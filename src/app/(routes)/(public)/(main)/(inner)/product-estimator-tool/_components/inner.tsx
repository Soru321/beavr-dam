"use client";

import { inferRouterOutputs } from "@trpc/server";
import { PlusSquareIcon, ShoppingCartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";

import { Button } from "@/components/ui/button";
import Heading2 from "@/components/ui/other/heading-2";
import { checkoutRoute } from "@/data/routes";
import { CartItem, useCart } from "@/lib/hooks/use-cart";
import { formatAmount, generateRandomString } from "@/lib/utils";
import { AppRouter } from "@/server/routers";

import { useCalculation } from "../_hooks/use-calculation";
import Calculation from "./calculation";

interface InnerProps {
  products: inferRouterOutputs<AppRouter>["product"]["get"];
}

export default function Inner({ products }: InnerProps) {
  const router = useRouter();
  const { items, addItem, amount, removeAllItems } = useCalculation();
  const cart = useCart();

  const onAddItems = () => {
    if (!products.length) return;

    const acc = items.reduce((acc: CartItem[], item) => {
      item.items.forEach((item1) => {
        const existingItem = acc.find(
          (cartItem) => !!cartItem.product && cartItem.product.id === item1.id,
        );

        if (existingItem) {
          existingItem.quantity += item1.quantity;
          existingItem.amount += item1.amount;
        } else {
          acc.push({
            id: generateRandomString(),
            product: products.find((product) => product.id === item1.id),
            quantity: item1.quantity,
            amount: item1.amount,
          });
        }
      });

      return acc;
    }, []);

    cart.addItems(acc);
    removeAllItems();
    router.push(checkoutRoute);
  };

  return (
    <div className="space-y-8">
      <Heading2>Product Estimator Tool</Heading2>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => addItem("Door")}
            className="space-x-1"
          >
            <PlusSquareIcon />
            <span>Door</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => addItem("Window")}
            className="space-x-1"
          >
            <PlusSquareIcon />
            <span>Window</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => addItem("Garage")}
            className="space-x-1"
          >
            <PlusSquareIcon />
            <span>Garage</span>
          </Button>

          {!!amount && (
            <Button
              size="lg"
              onClick={onAddItems}
              className="space-x-2 md:ml-auto"
            >
              <ShoppingCartIcon />
              <span>Add to cart ({formatAmount(amount)} USD)</span>
            </Button>
          )}
        </div>
        <Calculation products={products} />
      </div>
    </div>
  );
}
