import { InferSelectModel } from "drizzle-orm";

import { users } from "@/db/schemas/auth";

export type Role = "ADMIN" | "USER";

export type SignInResponse = Pick<
  InferSelectModel<typeof users>,
  "id" | "role" | "name" | "email" | "image"
>;

export type EmailVerificationType = "SIGN_UP" | "SIGN_IN" | "EMAIL_CHANGED";

export type EmailVerificationContent = {
  [key in EmailVerificationType]: { subject: string; content: string };
};
