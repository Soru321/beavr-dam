import { db } from "@/db";

import { publicProcedure, router } from "../trpc";

export const countryRouter = router({
  get: publicProcedure.query(async () => {
    return await db.query.countries.findMany();
  }),
});
