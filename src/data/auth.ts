import { EmailVerificationContent } from "@/lib/types/auth";

export const EMAIL_VERIFICATION_CONTENT: EmailVerificationContent = {
  SIGN_UP: {
    subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}. Please verify your email address`,
    content: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}. Please verify your email address to activate your account.`,
  },
  SIGN_IN: {
    subject: "Verify Your Email",
    content: "Please click the button below to verify your email address",
  },
  EMAIL_CHANGED: {
    subject: "Verify Your New Email",
    content: "Please click the button below to verify your new email address",
  },
};
