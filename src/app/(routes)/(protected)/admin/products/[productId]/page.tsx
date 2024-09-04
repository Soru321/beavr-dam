import { notFound } from "next/navigation";

import { trpcCaller } from "@/app/_trpc/caller";
import Heading from "@/components/admin/ui/heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import ProductForm from "./_components/product-form";

interface ProductPageProps {
  params: { productId: string };
}

export default async function ProductPage({
  params: { productId },
}: ProductPageProps) {
  const product = await (
    await trpcCaller()
  ).admin.product.getById({ id: productId });

  if (!product) {
    return notFound();
  }

  return (
    <Card className="space-y-6 rounded-3xl border-0 shadow-none sm:border sm:px-12 sm:py-16 sm:shadow-xl">
      <CardHeader className="p-0">
        <Heading>Edit Product</Heading>
      </CardHeader>
      <CardContent className="p-0">
        <ProductForm product={product} />
      </CardContent>
    </Card>
  );
}
