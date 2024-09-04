import { router } from "../trpc";
import { dashboardRouter } from "./admin/dashboard";
import { orderRouter } from "./admin/order";
import { pageRouter } from "./admin/page";
import { productRouter } from "./admin/product";
import { userRouter } from "./admin/user";

export const adminRouters = router({
  dashboard: dashboardRouter,
  user: userRouter,
  product: productRouter,
  order: orderRouter,
  page: pageRouter,
});
