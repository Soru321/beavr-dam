import { trpcCaller } from "@/app/_trpc/caller";
import Container from "@/components/ui/other/container";

import Inner from "./_components/inner";

export default async function Estimator() {
  const products = await (await trpcCaller()).product.get();

  return (
    <section>
      <Container>
        <Inner products={products} />
      </Container>
    </section>
  );
}
