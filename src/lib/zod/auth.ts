import { isMobilePhone } from 'validator';
import { z } from 'zod';

import { FIELD_REQUIRED } from '@/data/messages';

const schema = z.object({
  name: z.string().min(1, { message: FIELD_REQUIRED }),
  email: z
    .string()
    .min(1, { message: FIELD_REQUIRED })
    .email("The email must be a valid email"),
  password: z
    .string()
    .min(6, { message: "The password length must be between 6 and 15" })
    .max(15, { message: "The password length must be between 6 and 15" }),
  confirmPassword: z.string(),
  countryId: z.coerce.number().min(1, { message: FIELD_REQUIRED }),
  phoneNumber: z
    .string()
    .min(1, { message: FIELD_REQUIRED })
    .refine(isMobilePhone, { message: "The phone number is invalid" }),
  address: z.string().min(1, { message: FIELD_REQUIRED }),
  city: z.string(),
  postalCode: z.string().min(1, { message: FIELD_REQUIRED }),
});

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: FIELD_REQUIRED })
    .email("The email must be a valid email"),
  password: z.string().min(1, { message: FIELD_REQUIRED }),
});

export type SignIn = z.infer<typeof signInSchema>;

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "The password length must be between 6 and 15" })
      .max(15, { message: "The password length must be between 6 and 15" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The password and confirm password must match",
    path: ["confirmPassword"],
  });

export type ChangePassword = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: FIELD_REQUIRED })
    .email("The email must be a valid email"),
});

export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "The password length must be between 6 and 15" })
      .max(15, { message: "The password length must be between 6 and 15" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The password and confirm password must match",
    path: ["confirmPassword"],
  });

export type ResetPassword = z.infer<typeof resetPasswordSchema>;

export const serverResetPasswordSchema = resetPasswordSchema.and(
  z.object({
    email: z
      .string()
      .min(1, { message: "The email is required" })
      .email("The email must be a valid email"),
    token: z.string().min(1, { message: "The token is required" }),
  }),
);

export const profileSchema = schema.omit({
  password: true,
  confirmPassword: true,
});

export type Profile = z.infer<typeof profileSchema>;
