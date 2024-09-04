import { z } from "zod";

import { globalFilterSchema } from "../table";

export const getOrdersInputSchema = z.object({
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
        id: z.enum(["txnOrderId"]),
        desc: z.boolean(),
      }),
    )
    .optional(),
});
