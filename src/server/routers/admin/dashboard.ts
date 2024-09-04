import { endOfDay, format, isWithinInterval, subDays, subHours, subMonths } from 'date-fns';
import { and, desc, eq, ne } from 'drizzle-orm';

import { db } from '@/db';
import { users } from '@/db/schemas/auth';
import { DbOrderSelect, orders } from '@/db/schemas/orders';
import { formatAmount, formatNumber } from '@/lib/utils';
import { adminProcedure, router } from '@/server/trpc';

export const dashboardRouter = router({
  get: adminProcedure.query(async () => {
    const { revenue, sales, pendingOrders, graphRevenue, recentSales } =
      await calculateOrderMetrics();
    const { users: customers } = await calculateUserMetrics();

    return {
      revenue,
      sales,
      customers,
      pendingOrders,
      graphRevenue,
      recentSales,
    };
  }),
});

async function calculateOrderMetrics() {
  const dbOrders = await db.query.orders.findMany({
    where: and(eq(orders.txnStatus, "COMPLETED")),
    orderBy: desc(orders.id),
  });

  const days = 30;
  const hours = 24;
  const recentSalesCount = 5;
  const currentDate = endOfDay(new Date());

  const { revenueStats, salesStats, pendingOrdersStats, recentSalesStats } =
    dbOrders.reduce(
      (accumulator, order) => {
        accumulator.revenueStats.total += +order.amount;
        accumulator.salesStats.total += 1;

        if (accumulator.recentSalesStats.data.length < recentSalesCount) {
          accumulator.recentSalesStats.data.push({
            name: order.name,
            email: order.email,
            amount: formatAmount(order.amount),
          });
        }

        if (
          isWithinInterval(order.createdAt, {
            start: subDays(currentDate, days),
            end: currentDate,
          })
        ) {
          accumulator.revenueStats.limited += +order.amount;
          accumulator.salesStats.limited += 1;
          accumulator.recentSalesStats.limited += 1;
        }

        if (order.status === "PENDING") {
          accumulator.pendingOrdersStats.total += 1;

          if (
            isWithinInterval(order.createdAt, {
              start: subHours(currentDate, hours),
              end: currentDate,
            })
          ) {
            accumulator.pendingOrdersStats.limited += 1;
          }
        }

        return accumulator;
      },
      {
        revenueStats: { total: 0, limited: 0 },
        salesStats: { total: 0, limited: 0 },
        pendingOrdersStats: { total: 0, limited: 0 },
        recentSalesStats: {
          data: [] as Pick<DbOrderSelect, "name" | "email" | "amount">[],
          limited: 0,
        },
      },
    );

  const graphRevenue = await getGraphRevenue({ dbOrders });

  return {
    revenue: {
      value: formatAmount(revenueStats.total),
      limitedString: `+${formatAmount(
        revenueStats.limited,
      )} revenue in the last ${days > 1 ? `${days} days` : "day"}`,
    },
    sales: {
      value: `+${formatNumber(salesStats.total)}`,
      limitedString: `+${formatNumber(salesStats.limited)} ${
        salesStats.limited > 1 ? "sales" : "sale"
      } in the last ${days > 1 ? `${days} days` : "day"}`,
    },
    pendingOrders: {
      value: formatNumber(pendingOrdersStats.total),
      limitedString: `${formatNumber(pendingOrdersStats.limited)} pending ${
        pendingOrdersStats.limited > 1 ? "orders" : "order"
      } in the last ${hours > 1 ? `${hours} hours` : "hour"}`,
    },
    graphRevenue,
    recentSales: {
      data: recentSalesStats.data,
      limitedString: `You made ${formatNumber(recentSalesStats.limited)} ${
        recentSalesStats.limited > 1 ? "sales" : "sale"
      } in the last ${days} ${recentSalesStats.limited > 1 ? "days" : "day"}.`,
    },
  };
}

async function calculateUserMetrics() {
  const dbUsers = await db.query.users.findMany({
    where: and(eq(users.status, "ACTIVE"), ne(users.role, "ADMIN")),
  });

  const days = 30;
  const currentDate = endOfDay(new Date());

  const { userStats } = dbUsers.reduce(
    (accumulator, user) => {
      accumulator.userStats.total += 1;

      if (
        isWithinInterval(user.createdAt, {
          start: subDays(currentDate, days),
          end: currentDate,
        })
      ) {
        accumulator.userStats.limited += 1;
      }

      return accumulator;
    },
    {
      userStats: { total: 0, limited: 0 },
    },
  );

  return {
    users: {
      value: `+${formatNumber(userStats.total)}`,
      limitedString: `+${formatNumber(userStats.limited)} in the last ${
        days > 1 ? `${days} days` : "day"
      }`,
    },
  };
}

interface GetGraphRevenueProps {
  dbOrders: DbOrderSelect[];
  months?: number;
}

async function getGraphRevenue({
  dbOrders,
  months = 12,
}: GetGraphRevenueProps) {
  const currentDate = new Date();

  const monthlyRevenue: { [key: string]: number } = {};

  dbOrders.forEach((order) => {
    if (
      !isWithinInterval(order.createdAt, {
        start: subMonths(currentDate, months),
        end: currentDate,
      })
    ) {
      return;
    }

    const month = format(order.createdAt, "MMM");
    if (!!monthlyRevenue[month]) {
      monthlyRevenue[month] += +order.amount;
    } else {
      monthlyRevenue[month] = +order.amount;
    }
  });

  return Object.keys(monthlyRevenue).map((key) => ({
    month: key,
    revenue: monthlyRevenue[key],
  }));
}
