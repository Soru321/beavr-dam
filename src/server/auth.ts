import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { eq } from 'drizzle-orm';
import { getServerSession, NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';

import { signInAction } from '@/actions/auth';
import { db } from '@/db';
import { users } from '@/db/schemas/auth';

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Sign In",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await signInAction({
            email: credentials?.email ?? "",
            password: credentials?.password ?? "",
          });

          if (!user) return null;

          return user;
        } catch (error: any) {
          if (!!error.response?.data.key) {
            throw new Error(error.response?.data.message);
          }

          throw new Error(error.response?.data);
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "credentials") return true;
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, +user.id),
      });
      if (!existingUser?.emailVerified) return false;

      return true;
    },

    async jwt({ token, user }) {
      if (!!user) {
        token.id = +user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (!!session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
