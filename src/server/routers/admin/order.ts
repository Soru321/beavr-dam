import { asc, desc, eq, like, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { orders } from '@/db/schemas/orders';
import { getOrdersInputSchema } from '@/lib/zod/admin/order';
import { orderStatusSchema } from '@/lib/zod/order';
import { adminProcedure, router } from '@/server/trpc';

import { sendInvoiceFunc } from '../order';

export const orderRouter = router({
  get: adminProcedure.input(getOrdersInputSchema).query(async ({ input }) => {
    const orderBySorting = input?.sorting?.length
      ? input?.sorting?.map((item) =>
          item.desc ? desc(orders[item.id]) : asc(orders[item.id]),
        )
      : [desc(orders.id)];
    const whereGlobalFilter = !input?.filters?.globalFilter
      ? undefined
      : like(orders.txnOrderId, `%${input?.filters.globalFilter}%`);

    const countQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(whereGlobalFilter);
    const totalRecords = countQuery[0].count;

    const data = await db.query.orders.findMany({
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

  changeStatus: adminProcedure
    .input(z.object({ orderId: z.number(), status: orderStatusSchema }))
    .mutation(async ({ input }) => {
      await db
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.orderId));

      sendInvoiceFunc({
        db,
        orderId: input.orderId,
        orderStatus: input.status,
      });

      return { message: "Status changed successfully" };
    }),
});
