import { trpcCaller } from "@/app/_trpc/caller";
import Heading from "@/components/admin/ui/heading";
import { pageSchema, pageSizeSchema } from "@/lib/zod/table";

import List from "./_components/list";

export default async function OrdersPage() {
  const initialData = await (
    await trpcCaller()
  ).admin.user.get({
    page: pageSchema._def.defaultValue(),
    pageSize: pageSizeSchema._def.defaultValue(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading>Customers</Heading>
      </div>
      <List initialData={initialData} />
    </div>
  );
}
