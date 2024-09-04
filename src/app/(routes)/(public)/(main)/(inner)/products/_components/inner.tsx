"use client";

import { inferRouterOutputs } from "@trpc/server";

import { AddToCartDialog } from "@/components/ui/other/add-to-cart-dialog";
import ProductCard from "@/components/user/product-card";
import { useCart } from "@/lib/hooks/use-cart";
import { generateRandomString } from "@/lib/utils";
import { AppRouter } from "@/server/routers";

interface InnerProps {
  products: inferRouterOutputs<AppRouter>["product"]["get"];
}

export default function Inner({ products }: InnerProps) {
  const cart = useCart();

  const onAddToCart = (itemId: number) => {
    const product = products.find((item) => item.id === itemId);
    if (!product) return;

    cart.addItem({
      id: generateRandomString(),
      product,
      quantity: 1,
      amount: +product.price,
    });
  };
  return (
    <>
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {products.map((item, index) => (
          <ProductCard key={`product-${index}`} item={item} />
        ))}
      </div>

      <AddToCartDialog onAdd={onAddToCart} />
    </>
  );
}
