import Heading from "@/components/admin/ui/heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import ProductForm from "./_components/product-form";

export default async function ProductPage() {
  return (
    <Card className="space-y-6 rounded-3xl border-0 shadow-none sm:border sm:px-12 sm:py-16 sm:shadow-xl">
      <CardHeader className="p-0">
        <Heading>Create Product</Heading>
      </CardHeader>
      <CardContent className="p-0">
        <ProductForm />
      </CardContent>
    </Card>
  );
}
