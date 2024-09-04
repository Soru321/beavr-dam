import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { pages } from "@/db/schemas/pages";

import { publicProcedure, router } from "../trpc";

export const pageRouter = router({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const data = await db.query.pages.findFirst({
        where: eq(pages.slug, input.slug),
      });

      return data;
    }),
});
