import { TRPCError } from '@trpc/server';
import { hash } from 'bcrypt';
import { add, isPast } from 'date-fns';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { userInfo, users, verificationTokens } from '@/db/schemas/auth';
import { sendEmailVerification } from '@/emails/email-verification';
import { sendResetPasswordEmail } from '@/emails/reset-password';
import { generateRandomString } from '@/lib/utils';
import {
    changePasswordSchema, forgotPasswordSchema, profileSchema, serverResetPasswordSchema
} from '@/lib/zod/auth';

import { protectedProcedure, publicProcedure, router } from '../trpc';

export const authRouter = router({
  getCurrent: protectedProcedure.query(async ({ ctx: { session } }) => {
    const data = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { password: false },
      with: { userInfo: { with: { country: true } } },
    });

    return data;
  }),

  verifyEmail: publicProcedure
    .input(z.object({ email: z.string().email(), token: z.string() }))
    .mutation(async ({ input }) => {
      const { verificationToken, hasExpired } = await verifyTokenFunc({
        email: input.email,
        token: input.token,
      });

      if (hasExpired) {
        sendEmailVerification({
          type: "SIGN_IN",
          userId: verificationToken.user.id,
          email: verificationToken.email,
          userName: verificationToken.user.name,
        });

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Link has expired! We have sent you new verification link.",
          cause: "EXPIRED_TOKEN",
        });
      }

      await Promise.all([
        db
          .update(users)
          .set({ email: verificationToken.email, emailVerified: new Date() })
          .where(eq(users.id, verificationToken.user.id)),

        db
          .delete(verificationTokens)
          .where(eq(verificationTokens.id, verificationToken.id)),
      ]);

      return { message: "Email verified successfully." };
    }),

  sendResetPasswordLink: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (user) {
        sendResetPasswordLinkFunc({ userId: user.id, email: user.email });
      }

      return { message: "Password reset email sent!" };
    }),

  resetPassword: publicProcedure
    .input(serverResetPasswordSchema)
    .mutation(async ({ input }) => {
      const { verificationToken, hasExpired } = await verifyTokenFunc({
        email: input.email,
        token: input.token,
      });

      if (hasExpired) {
        sendResetPasswordLinkFunc({
          userId: verificationToken.user.id,
          email: verificationToken.user.email,
        });

        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Link has expired! We have sent you new reset password link.",
          cause: "EXPIRED_TOKEN",
        });
      }

      const password = await hash(input.password, 10);
      await Promise.all([
        db
          .update(users)
          .set({ password })
          .where(eq(users.id, verificationToken.user.id)),

        db
          .delete(verificationTokens)
          .where(eq(verificationTokens.id, verificationToken.id)),
      ]);

      return { message: "Password reset successfully!" };
    }),

  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      const password = await hash(input.password, 10);

      await db
        .update(users)
        .set({ password })
        .where(eq(users.id, session.user.id));

      return { message: "Password changed successfully" };
    }),
});

interface SendResetPasswordLinkFuncProps {
  userId: number;
  email: string;
}

export async function generateVerificationTokenFunc({
  userId,
  email,
}: SendResetPasswordLinkFuncProps) {
  const token = generateRandomString();
  const expiresAt = add(new Date(), { hours: 1 });

  const existingToken = await getVerificationTokenByEmailFunc(email);
  if (!existingToken) {
    await db
      .insert(verificationTokens)
      .values({ userId, email, token, expiresAt });
  } else {
    await db
      .update(verificationTokens)
      .set({ token, expiresAt })
      .where(eq(verificationTokens.id, existingToken.id));
  }

  return {
    email,
    token,
    expiresAt,
  };
}

interface VerifyTokenFuncProps {
  email: string;
  token: string;
}

async function verifyTokenFunc({ email, token }: VerifyTokenFuncProps) {
  const verificationToken = await db.query.verificationTokens.findFirst({
    where: and(
      eq(verificationTokens.email, email),
      eq(verificationTokens.token, token),
    ),
    with: { user: true },
  });

  if (!verificationToken) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Invalid token!",
    });
  }

  const hasExpired = isPast(new Date(verificationToken.expiresAt));

  return { verificationToken, hasExpired };
}

async function getVerificationTokenByEmailFunc(email: string) {
  return await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.email, email),
  });
}

interface SendResetPasswordLinkFuncProps {
  userId: number;
  email: string;
}

async function sendResetPasswordLinkFunc({
  userId,
  email,
}: SendResetPasswordLinkFuncProps) {
  const { token } = await generateVerificationTokenFunc({ userId, email });
  const url = new URL("/reset-password", process.env.NEXT_PUBLIC_APP_URL);
  url.searchParams.append("email", email);
  url.searchParams.append("token", token);
  const link = url.toString();

  sendResetPasswordEmail(email, link);
}
