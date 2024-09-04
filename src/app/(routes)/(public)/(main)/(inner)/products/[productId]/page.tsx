import { trpcCaller } from "@/app/_trpc/caller";
import Container from "@/components/ui/other/container";

import Inner from "./_components/inner";

interface ProductPageProps {
  params: { productId: string };
}

export default async function ProductPage({
  params: { productId },
}: ProductPageProps) {
  const product = await (await trpcCaller()).product.getById({ id: productId });

  return (
    <Container>
      <Inner product={product} />
    </Container>
  );
}
