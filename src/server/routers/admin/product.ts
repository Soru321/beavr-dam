import { TRPCError } from '@trpc/server';
import { asc, desc, eq, inArray, like, sql } from 'drizzle-orm';
import { unlinkSync } from 'fs';
import { Session } from 'next-auth';
import { join } from 'path';
import { z } from 'zod';

import { INTERNAL_SERVER_ERROR } from '@/data/error-messages';
import { Db, db } from '@/db';
import { DbFilesSelect, files } from '@/db/schemas/files';
import { orderProducts } from '@/db/schemas/orders';
import {
    DbProductFilesInsert, DbProductFilesSelect, DbProductInsert, productFiles, products
} from '@/db/schemas/products';
import { DbTmpFilesSelect } from '@/db/schemas/tmp-files';
import { moveFiles } from '@/lib/server/utils';
import { idNumberSchema, idStringSchema } from '@/lib/zod';
import {
    getProductsInputSchema, ProductInsert, productInsertSchema, ProductUpdate, productUpdateSchema
} from '@/lib/zod/admin/product';

import { adminProcedure, router } from '../../trpc';
import { getTmpFilesByIds } from './tmp-files';

export const productRouter = router({
  get: adminProcedure.input(getProductsInputSchema).query(async ({ input }) => {
    const orderBySorting = input?.sorting?.length
      ? input?.sorting?.map((item) =>
          item.desc ? desc(products[item.id]) : asc(products[item.id]),
        )
      : [desc(products.id)];
    const whereGlobalFilter = !input?.filters?.globalFilter
      ? undefined
      : like(products.name, `%${input?.filters.globalFilter}%`);

    const countQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereGlobalFilter);
    const totalRecords = countQuery[0].count;

    const data = await db.query.products.findMany({
      where: whereGlobalFilter,
      orderBy: orderBySorting,
      offset:
        !!input?.page && !!input.pageSize
          ? input.page * input.pageSize
          : undefined,
      limit: input?.pageSize,
    });

    return { totalRecords, data };
  }),

  getById: adminProcedure.input(idStringSchema).mutation(async ({ input }) => {
    return await getByIdFunc({ db, id: +input.id });
  }),

  create: adminProcedure
    .input(productInsertSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      const { images } = await storeFiles({ db, session, input });

      await db.transaction(async (tx) => {
        const product = await tx
          .insert(products)
          .values(insertUpdateFields({ input }));

        await insertProductFiles({
          images,
          productId: product[0].insertId,
          tx,
        });
      });

      return { message: "Product created successfully" };
    }),

  update: adminProcedure
    .input(productUpdateSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      const product = await getByIdFunc({ db, id: input.id });
      if (!product) {
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "Please provide valid product ID.",
        });
      }

      if (
        !input.images.length &&
        input.deletedImages.length > product.productFiles.length
      ) {
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "The images field is required",
        });
      }

      const { images } = !!input.images.length
        ? await storeFiles({ db, session, input })
        : { images: [] };

      await db.transaction(async (tx) => {
        await tx
          .update(products)
          .set(insertUpdateFields({ input }))
          .where(eq(products.id, product.id));

        if (!!images.length) {
          await insertProductFiles({
            images,
            productId: product.id,
            tx,
          });
        }

        if (!!input.deletedImages.length) {
          const productFilesToDelete = await tx.query.productFiles.findMany({
            where: inArray(productFiles.id, input.deletedImages),
            with: { file: true },
          });
          if (!!productFilesToDelete.length) {
            await deleteProductFilesFunc({ items: productFilesToDelete });
          }

          await tx
            .delete(productFiles)
            .where(inArray(productFiles.id, input.deletedImages));
        }
      });

      return { message: "Product updated successfully" };
    }),

  deleteById: adminProcedure
    .input(idNumberSchema)
    .mutation(async ({ input }) => {
      const product = await getByIdFunc({ db, id: input.id });
      if (!!product?.productFiles.length) {
        await deleteProductFilesFunc({ items: product?.productFiles });
      }
      await db.delete(products).where(eq(products.id, input.id));

      return { message: "Product deleted successfully" };
    }),

  changeIsFeatured: adminProcedure
    .input(z.object({ productId: z.number(), isFeatured: z.boolean() }))
    .mutation(async ({ input }) => {
      await db
        .update(products)
        .set({ isFeatured: input.isFeatured })
        .where(eq(products.id, input.productId));

      return {
        message: input.isFeatured
          ? "Product is now featured!"
          : "Product is no longer featured!",
      };
    }),
});

interface StoreFilesProps {
  db: Db;
  session: Session | null;
  input: ProductInsert | ProductUpdate;
}

async function storeFiles({ db, session, input }: StoreFilesProps) {
  const tmpFiles = await getTmpFilesByIds({
    db,
    session,
    ids: input.images,
  });

  const images = await moveFiles({
    tmpFiles,
    targetStorage: process.env.PUBLIC_STORAGE,
    targetPath: "storage/product",
  });

  if (!images.length) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "The image field is required.",
    });
  }

  return { images };
}

interface GetByIdFuncProps {
  db: Db;
  id: number;
}

async function getByIdFunc({ db, id }: GetByIdFuncProps) {
  return await db.query.products.findFirst({
    where: eq(products.id, id),
    with: { productFiles: { with: { file: true } } },
  });
}

interface InsertUpdateFieldsProps {
  input: ProductInsert | ProductUpdate;
}

function insertUpdateFields({
  input,
}: InsertUpdateFieldsProps): DbProductInsert {
  const { type } = input;

  return {
    name: input.name,
    type,
    price: input.price.toString(),
    width: type === "POLE" ? input.width : null,
    minWidth: type === "GATE" ? input.minWidth : null,
    maxWidth: type === "GATE" ? input.maxWidth : null,
    height: type === "GATE" ? input.height : null,
    minHeight: type === "POLE" ? input.minHeight : null,
    maxHeight: type === "POLE" ? input.maxHeight : null,
    sku: input.sku,
    isFeatured: input.isFeatured,
    shortDescription: input.shortDescription,
    description: input.description,
  };
}

interface InsertProductFilesProps {
  images: DbTmpFilesSelect[];
  productId: number;
  tx: Db;
}

async function insertProductFiles({
  images,
  productId,
  tx,
}: InsertProductFilesProps) {
  const inserts = await Promise.all(
    images.map((image) =>
      tx.insert(files).values({
        mimeType: image.mimeType,
        name: image.name,
        path: image.path,
      }),
    ),
  );

  const productFilesValues: DbProductFilesInsert[] = inserts.map(
    ([{ insertId }]) => ({
      productId,
      fileId: insertId,
    }),
  );

  if (!!productFilesValues.length) {
    await tx.insert(productFiles).values(productFilesValues);
  }
}

interface DeleteProductFilesFuncProps {
  items: (DbProductFilesSelect & { file: DbFilesSelect })[];
}

async function deleteProductFilesFunc({ items }: DeleteProductFilesFuncProps) {
  try {
    const fileIds = items.map((item) => item.fileId);
    const orders = await db.query.orderProducts.findMany({
      where: inArray(orderProducts.fileId, fileIds),
    });
    const ordersFileIds = orders.map((order) => order.fileId);
    const fileIdsToDelete = fileIds.filter(
      (fileId) => !ordersFileIds.includes(fileId),
    );

    items.forEach((item) => {
      if (fileIdsToDelete.includes(item.fileId)) {
        unlinkSync(join(process.env.PUBLIC_STORAGE, item.file.path));
      }
    });

    await db.delete(files).where(inArray(files.id, fileIdsToDelete));
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: INTERNAL_SERVER_ERROR,
    });
  }
}
