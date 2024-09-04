import { z } from 'zod';

import { FIELD_REQUIRED } from '@/data/messages';

export const pageSchema = z.object({
  slug: z.string().min(1, { message: "The slug is required" }),
  content: z.string().min(1, { message: FIELD_REQUIRED }),
  status: z.boolean(),
});

export type Page = z.infer<typeof pageSchema>;
