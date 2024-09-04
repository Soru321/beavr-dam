import { router } from "../trpc";
import { adminRouters } from "./admin-routers";
import { authRouter } from "./auth";
import { contactRouter } from "./contact";
import { countryRouter } from "./country";
import { orderRouter } from "./order";
import { pageRouter } from "./page";
import { productRouter } from "./product";

export const appRouter = router({
  admin: adminRouters,

  country: countryRouter,
  auth: authRouter,
  product: productRouter,
  order: orderRouter,
  page: pageRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
