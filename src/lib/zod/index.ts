import { z } from "zod";

export const idSchema = z.object({ id: z.string().pipe(z.coerce.number()) });
export const idNumberSchema = z.object({ id: z.number() });
export const idStringSchema = z.object({ id: z.string() });
