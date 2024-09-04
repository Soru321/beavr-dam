import { trpcCaller } from "@/app/_trpc/caller";
import Heading from "@/components/admin/ui/heading";
import { createTitleFromSlug, createValidSlug } from "@/lib/utils";

import PageForm from "./_components/page-form";

interface PagePageProps {
  params: { pageSlug: string };
}

export default async function PagePage({
  params: { pageSlug },
}: PagePageProps) {
  pageSlug = createValidSlug(pageSlug);
  const page = await (
    await trpcCaller()
  ).admin.page.getBySlug({ slug: pageSlug });

  return (
    <div className="space-y-6">
      <Heading>{createTitleFromSlug(pageSlug)}</Heading>
      <PageForm pageSlug={pageSlug} page={page} />
    </div>
  );
}
