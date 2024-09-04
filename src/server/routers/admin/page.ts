import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { pages } from "@/db/schemas/pages";
import { createTitleFromSlug, createValidSlug } from "@/lib/utils";
import { pageSchema } from "@/lib/zod/admin/page";
import { adminProcedure, router } from "@/server/trpc";

export const pageRouter = router({
  getBySlug: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const data = await db.query.pages.findFirst({
        where: eq(pages.slug, input.slug),
      });

      return data;
    }),

  createOrUpdate: adminProcedure
    .input(pageSchema)
    .mutation(async ({ input }) => {
      const slug = createValidSlug(input.slug);
      const title = createTitleFromSlug(slug);

      const page = await db.query.pages.findFirst({
        where: eq(pages.slug, slug),
      });

      if (!page) {
        await db.insert(pages).values({
          title,
          slug,
          content: input.content,
          status: input.status,
        });
      }

      await db
        .update(pages)
        .set({ content: input.content, status: input.status })
        .where(eq(pages.slug, slug));

      return {
        message: `${title} ${!page ? "created" : "updated"} successfully`,
      };
    }),
});
