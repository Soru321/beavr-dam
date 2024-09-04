import { trpcCaller } from '@/app/_trpc/caller';
import Container from '@/components/ui/other/container';
import Heading from '@/components/ui/other/heading';

import List from './list';

export default async function ProductsSection() {
  const products = await (await trpcCaller()).product.get({ isFeatured: true });

  return (
    !!products.length && (
      <section id="products">
        <Container>
          <div className="space-y-12">
            {/* Heading */}
            <Heading className="whitespace-nowrap text-center text-primary">
              Products
            </Heading>

            {/* Products */}
            <div className="gap-12 md:grid md:grid-cols-2 lg:grid-cols-3">
              <List products={products} />
            </div>
          </div>
        </Container>
      </section>
    )
  );
}
