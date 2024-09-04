import { z } from 'zod';

import { FIELD_REQUIRED } from '@/data/messages';

import { productType } from '../product';
import { globalFilterSchema } from '../table';

const schema = z.object({
  type: productType.default("GATE"),
  name: z.string().min(1, { message: FIELD_REQUIRED }),
  price: z.coerce.number().min(1, { message: FIELD_REQUIRED }),
  width: z.coerce.number({ required_error: "abc" }).optional(),
  height: z.coerce.number().optional(),
  minWidth: z.coerce.number().optional(),
  maxWidth: z.coerce.number().optional(),
  minHeight: z.coerce.number().optional(),
  maxHeight: z.coerce.number().optional(),
  sku: z.string(),
  isFeatured: z.boolean(),
  shortDescription: z.string().min(1, { message: FIELD_REQUIRED }),
  description: z.string(),
  images: z.coerce.number().array().nonempty({ message: FIELD_REQUIRED }),
});

export const productInsertSchema = schema
  .refine((data) => (data.type === "GATE" ? !!data.minWidth : true), {
    message: FIELD_REQUIRED,
    path: ["minWidth"],
  })
  .refine((data) => (data.type === "GATE" ? !!data.maxWidth : true), {
    message: FIELD_REQUIRED,
    path: ["maxWidth"],
  })
  .refine((data) => (data.type === "GATE" ? !!data.height : true), {
    message: FIELD_REQUIRED,
    path: ["height"],
  })
  .refine((data) => (data.type === "POLE" ? !!data.width : true), {
    message: FIELD_REQUIRED,
    path: ["width"],
  })
  .refine((data) => (data.type === "POLE" ? !!data.minHeight : true), {
    message: FIELD_REQUIRED,
    path: ["minHeight"],
  })
  .refine((data) => (data.type === "POLE" ? !!data.maxHeight : true), {
    message: FIELD_REQUIRED,
    path: ["maxHeight"],
  });

export type ProductInsert = z.infer<typeof productInsertSchema>;

export const productUpdateSchema = schema.extend({
  id: z.coerce.number().min(1, { message: FIELD_REQUIRED }),
  images: z.coerce.number().array(),
  deletedImages: z.coerce.number().array(),
});

export type ProductUpdate = z.infer<typeof productUpdateSchema>;

export const getProductsInputSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  filters: z
    .object({
      globalFilter: globalFilterSchema,
    })
    .optional(),
  sorting: z
    .array(
      z.object({
        id: z.enum([
          "name",
          "price",
          "width",
          "minWidth",
          "maxWidth",
          "height",
          "minHeight",
          "maxHeight",
        ]),
        desc: z.boolean(),
      }),
    )
    .optional(),
});
