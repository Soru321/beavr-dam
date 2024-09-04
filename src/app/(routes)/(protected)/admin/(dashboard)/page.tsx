import Link from 'next/link';
import { BsGraphUpArrow } from 'react-icons/bs';
import { FaUsers } from 'react-icons/fa';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { RiShoppingBag3Fill } from 'react-icons/ri';

import { trpcCaller } from '@/app/_trpc/caller';
import Heading from '@/components/admin/ui/heading';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ordersRoute } from '@/data/routes/admin';
import { cn } from '@/lib/utils';

import Overview from './_components/overview';
import RecentSales from './_components/recent-sales';

export default async function DashboardPage() {
  const {
    revenue,
    sales,
    customers,
    pendingOrders,
    graphRevenue,
    recentSales,
  } = await (await trpcCaller()).admin.dashboard.get();

  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 space-y-6">
          <Heading>Dashboard</Heading>

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {/* Total Revenue */}
            <Card className="relative overflow-hidden transition hover:scale-105 hover:shadow-xl">
              <div className="absolute bottom-0 right-0 size-52 translate-x-1/2 translate-y-1/2 rounded-full bg-primary">
                <FaMoneyBillTrendUp
                  strokeWidth={1.2}
                  className="absolute inset-0 m-auto size-10 -translate-x-full -translate-y-full text-white"
                />
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="max-w-52">
                <div className="text-2xl font-bold">{revenue.value}</div>
                <p className="text-xs text-muted-foreground">
                  {revenue.limitedString}
                </p>
              </CardContent>
            </Card>

            {/* Sales */}
            <Card className="relative overflow-hidden transition hover:scale-105 hover:shadow-xl">
              <div className="absolute bottom-0 right-0 size-52 translate-x-1/2 translate-y-1/2 rounded-full bg-primary">
                <BsGraphUpArrow
                  strokeWidth={1.2}
                  className="absolute inset-0 m-auto size-10 -translate-x-full -translate-y-full text-white"
                />
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Sales</CardTitle>
              </CardHeader>
              <CardContent className="max-w-52">
                <div className="text-2xl font-bold">{sales.value}</div>
                <p className="text-xs text-muted-foreground">
                  {sales.limitedString}
                </p>
              </CardContent>
            </Card>

            {/* Customers */}
            <Card className="relative overflow-hidden transition hover:scale-105 hover:shadow-xl">
              <div className="absolute bottom-0 right-0 size-52 translate-x-1/2 translate-y-1/2 rounded-full bg-primary">
                <FaUsers
                  strokeWidth={1.2}
                  className="absolute inset-0 m-auto size-10 -translate-x-full -translate-y-full text-white"
                />
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  Customers
                </CardTitle>
              </CardHeader>
              <CardContent className="max-w-52">
                <div className="text-2xl font-bold">{customers.value}</div>
                <p className="text-xs text-muted-foreground">
                  {customers.limitedString}
                </p>
              </CardContent>
            </Card>

            {/* Pending Orders */}
            <Card className="relative overflow-hidden transition hover:scale-105 hover:shadow-xl">
              <div className="absolute bottom-0 right-0 size-52 translate-x-1/2 translate-y-1/2 rounded-full bg-primary">
                <RiShoppingBag3Fill className="absolute inset-0 m-auto size-10 -translate-x-full -translate-y-full text-white" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  Pending Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="max-w-52">
                <div className="text-2xl font-bold">{pendingOrders.value}</div>
                <p className="text-xs text-muted-foreground">
                  {pendingOrders.limitedString}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Graph */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview items={graphRevenue} />
              </CardContent>
            </Card>

            {/* Recent sales */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Sales</span>
                  <Link
                    href={ordersRoute}
                    className={cn(buttonVariants({ variant: "link" }), "p-0")}
                  >
                    View All
                  </Link>
                </CardTitle>
                <CardDescription>{recentSales.limitedString}</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales items={recentSales.data} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
