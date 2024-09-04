import "@/styles/jodit.css";

import { notFound } from "next/navigation";

import { trpcCaller } from "@/app/_trpc/caller";
import Container from "@/components/ui/other/container";

interface PagePageProps {
  params: { pageSlug: string };
}

export default async function PagePage({
  params: { pageSlug },
}: PagePageProps) {
  const page = await (await trpcCaller()).page.getBySlug({ slug: pageSlug });

  if (!page || !page.status) {
    notFound();
  }

  return (
    <Container>
      <div dangerouslySetInnerHTML={{ __html: page?.content ?? "" }} />
    </Container>
  );
}
