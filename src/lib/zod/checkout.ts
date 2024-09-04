import { isMobilePhone } from 'validator';
import { z } from 'zod';

import { FIELD_REQUIRED } from '@/data/messages';

export const orderDetailsSchema = z.object({
  name: z.string().min(1, { message: FIELD_REQUIRED }),
  email: z
    .string()
    .min(1, { message: FIELD_REQUIRED })
    .email("The email must be a valid email"),
  countryId: z.coerce.number().min(1, { message: FIELD_REQUIRED }),
  phoneNumber: z
    .string()
    .min(1, { message: FIELD_REQUIRED })
    .refine(isMobilePhone, { message: "The phone number is invalid" }),
  address: z.string().min(1, { message: FIELD_REQUIRED }),
  city: z.string(),
  postalCode: z.string().min(1, { message: FIELD_REQUIRED }),
});

export type OrderDetails = z.infer<typeof orderDetailsSchema>;
