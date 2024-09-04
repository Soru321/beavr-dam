import { trpcCaller } from "@/app/_trpc/caller";
import Container from "@/components/ui/other/container";

import Inner from "./_components/inner";

export default async function CheckoutPage() {
  const countries = await (await trpcCaller()).country.get();

  return (
    <section>
      <Container>
        <Inner countries={countries} />
      </Container>
    </section>
  );
}
