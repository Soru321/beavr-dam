import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { products } from "@/db/schemas/products";
import { idSchema } from "@/lib/zod";

import { publicProcedure, router } from "../trpc";

export const productRouter = router({
  get: publicProcedure
    .input(z.object({ isFeatured: z.boolean().default(false) }).optional())
    .query(async ({ input }) => {
      const data = await db.query.products.findMany({
        where: input?.isFeatured
          ? eq(products.isFeatured, input.isFeatured)
          : undefined,
        with: { productFiles: { with: { file: true } } },
      });

      return data;
    }),

  getById: publicProcedure.input(idSchema).query(async ({ input }) => {
    const data = await db.query.products.findFirst({
      where: eq(products.id, input.id),
      with: { productFiles: { with: { file: true } } },
    });

    return data;
  }),
});
