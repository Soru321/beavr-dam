import { z } from "zod";

export const pageSchema = z.coerce.number().positive().default(0);
export const pageSizeSchema = z.coerce.number().positive().default(5);
// export const sorting =
export const globalFilterSchema = z.string().default("");
