import { z } from 'zod';

import { FIELD_REQUIRED } from '@/data/messages';

export const profileSchema = z.object({
  name: z.string().min(1, { message: FIELD_REQUIRED }),
  email: z
    .string()
    .min(1, { message: FIELD_REQUIRED })
    .email("The email must be a valid email"),
});

export type Profile = z.infer<typeof profileSchema>;
