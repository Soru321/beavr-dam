import { and, asc, desc, eq, like, ne, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { users } from "@/db/schemas/auth";
import { sendEmailVerification } from "@/emails/email-verification";
import { profileSchema } from "@/lib/zod/admin/profile";
import { getUsersInputSchema } from "@/lib/zod/admin/user";
import { adminProcedure, router } from "@/server/trpc";

export const userRouter = router({
  get: adminProcedure.input(getUsersInputSchema).query(async ({ input }) => {
    const orderBySorting = input?.sorting?.length
      ? input?.sorting?.map((item) =>
          item.desc ? desc(users.id) : asc(users.id),
        )
      : [desc(users.id)];
    const whereGlobalFilter = and(
      ne(users.role, "ADMIN"),
      !input?.filters?.globalFilter
        ? undefined
        : like(users.name, `%${input?.filters.globalFilter}%`),
    );

    const countQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereGlobalFilter);
    const totalRecords = countQuery[0].count;

    const data = await db.query.users.findMany({
      columns: { password: false },
      with: { userInfo: { with: { country: true } } },
      where: whereGlobalFilter,
      orderBy: orderBySorting,
      offset:
        !!input?.page && !!input.pageSize
          ? input.page * input.pageSize
          : undefined,
      limit: input?.pageSize,
    });

    return { totalRecords, data };
  }),

  updateProfile: adminProcedure
    .input(profileSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      await db
        .update(users)
        .set({ name: input.name })
        .where(eq(users.id, session.user.id));

      const messages: string[] = [];

      if (input.email !== session.user.email) {
        messages.push(
          "Verification email sent! Your email will be changed after verification.",
        );

        sendEmailVerification({
          type: "EMAIL_CHANGED",
          userId: session.user.id,
          email: input.email,
          userName: input.name,
        });
      }

      messages.push("Profile updated successfully!");

      return { messages };
    }),
});
