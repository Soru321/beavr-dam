import { z } from "zod";

import { globalFilterSchema } from "../table";

export const getUsersInputSchema = z.object({
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
        id: z.enum(["name"]),
        desc: z.boolean(),
      }),
    )
    .optional(),
});
