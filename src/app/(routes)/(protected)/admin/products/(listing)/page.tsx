import { PackagePlusIcon } from 'lucide-react';
import Link from 'next/link';

import { trpcCaller } from '@/app/_trpc/caller';
import Heading from '@/components/admin/ui/heading';
import { buttonVariants } from '@/components/ui/button';
import { createProductRoute } from '@/data/routes/admin';
import { cn } from '@/lib/utils';
import { pageSchema, pageSizeSchema } from '@/lib/zod/table';

import List from './_components/list';

export default async function ProductsPage() {
  const initialData = await (
    await trpcCaller()
  ).admin.product.get({
    page: pageSchema._def.defaultValue(),
    pageSize: pageSizeSchema._def.defaultValue(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading>Products</Heading>
        <Link
          href={createProductRoute}
          className={cn("space-x-2", buttonVariants({ variant: "default" }))}
        >
          <PackagePlusIcon />
          <span>Create</span>
        </Link>
      </div>
      <List initialData={initialData} />
    </div>
  );
}
