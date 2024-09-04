import Link from 'next/link';

import { trpcCaller } from '@/app/_trpc/caller';
import { Card, CardContent } from '@/components/ui/card';
import Container from '@/components/ui/other/container';
import Heading from '@/components/ui/other/heading';
import { productEstimatorToolRoute } from '@/data/routes';

import Inner from './_components/inner';

export default async function ProductsPage() {
  const products = await (await trpcCaller()).product.get();

  return (
    <Container className="space-y-20">
      <>
        <div className="space-y-12">
          {/* Heading */}
          <Heading className="whitespace-nowrap text-center text-primary">
            Products
          </Heading>
          <Inner products={products} />
        </div>

        <Card className="mx-auto max-w-[502px] rounded-3xl p-6 lg:shadow-2xl">
          <CardContent className="p-0">
            <p className="text-center text-lg">
              Not sure what to order?{" "}
              <Link
                href={productEstimatorToolRoute}
                className="text-primary hover:underline"
              >
                Click here
              </Link>{" "}
              to get an accurate estimate of what your house needs using our{" "}
              <span className="font-semibold">Product Estimator Tool</span>.
            </p>
          </CardContent>
        </Card>
      </>
    </Container>
  );
}
