"use client";

import "@/styles/jodit.css";

import { inferRouterOutputs } from "@trpc/server";
import { motion as m, stagger, useAnimate } from "framer-motion";
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import { useLayoutEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { AddToCartDialog } from "@/components/ui/other/add-to-cart-dialog";
import { Separator } from "@/components/ui/separator";
import { useAddToCartDialog } from "@/lib/hooks/use-add-to-cart-dialog";
import { useCart } from "@/lib/hooks/use-cart";
import { formatAmount, generateRandomString } from "@/lib/utils";
import { AppRouter } from "@/server/routers";

import Carousel from "./carousel";

interface InnerProps {
  product: inferRouterOutputs<AppRouter>["product"]["getById"];
}

export default function Inner({ product }: InnerProps) {
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();
  const [scope, animate] = useAnimate();
  const addToCartDialog = useAddToCartDialog();

  const onAddToCart = () => {
    if (!product) return;

    cart.addItem({
      id: generateRandomString(),
      product,
      quantity,
      amount: +product.price * quantity,
    });
  };

  useLayoutEffect(() => {
    animate([
      [".product-images", { opacity: 1, x: 0 }, {}],
      [".product-item", { opacity: 1, y: 0 }, { delay: stagger(0.2) }],
    ]);
  }, [animate]);

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <>
      <div ref={scope} className="flex min-w-full flex-col gap-10 xl:flex-row">
        <div className="xl:w-2/5">
          <Carousel product={product} />
        </div>
        <div className="space-y-6 xl:w-3/5">
          <m.h2
            style={{ opacity: 0, y: 50 }}
            className="product-item w-fit origin-left text-3xl text-primary"
          >
            {product?.name}
          </m.h2>

          {!!product?.shortDescription && (
            <m.p
              style={{ opacity: 0, y: 50 }}
              className="product-item text-foreground/80"
            >
              {product.shortDescription}
            </m.p>
          )}

          <div>
            {!!product?.price && (
              <m.p
                style={{ opacity: 0, y: 50 }}
                className="product-item text-lg"
              >
                Price:{" "}
                <span className="font-bold">{formatAmount(product.price)}</span>
              </m.p>
            )}
            {!!product?.width && (
              <m.p
                style={{ opacity: 0, y: 50 }}
                className="product-item text-lg"
              >
                Width: <span className="font-bold">{product.width} inches</span>
              </m.p>
            )}
            {!!product?.minWidth && !!product.maxWidth && (
              <m.p
                style={{ opacity: 0, y: 50 }}
                className="product-item text-lg"
              >
                Width:{" "}
                <span className="font-bold">
                  {product.minWidth} inches extends upto {product.maxWidth}{" "}
                  inches
                </span>
              </m.p>
            )}
            {!!product?.height && (
              <m.p
                style={{ opacity: 0, y: 50 }}
                className="product-item text-lg"
              >
                Height:{" "}
                <span className="font-bold">{product.height} inches</span>
              </m.p>
            )}
            {!!product?.minHeight && !!product?.maxHeight && (
              <m.p
                style={{ opacity: 0, y: 50 }}
                className="product-item text-lg"
              >
                Height:{" "}
                <span className="font-bold">
                  {product.minHeight} inches extends upto {product.maxHeight}{" "}
                  inches
                </span>
              </m.p>
            )}
          </div>

          <m.div
            style={{ opacity: 0, y: 50 }}
            className="product-item flex items-center gap-4"
          >
            <span className="text-lg">Quantity:</span>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                disabled={quantity === 1}
                onClick={decrementQuantity}
              >
                <MinusIcon />
              </Button>
              <span className="w-16 select-none text-center text-xl">
                {quantity}
              </span>
              <Button variant="outline" size="sm" onClick={incrementQuantity}>
                <PlusIcon />
              </Button>
            </div>
          </m.div>

          {!!product?.price && !!quantity && (
            <m.div style={{ opacity: 0, y: 50 }} className="product-item">
              <Button
                size="lg"
                onClick={() => addToCartDialog.open(product.id)}
                className="space-x-2"
              >
                <ShoppingCartIcon />
                <span>
                  Add to cart ({formatAmount(+product.price * quantity)} USD)
                </span>
              </Button>
            </m.div>
          )}

          <m.div style={{ opacity: 0, y: 50 }} className="product-item">
            <Separator />
          </m.div>
          <m.div
            style={{ opacity: 0, y: 50 }}
            dangerouslySetInnerHTML={{ __html: product?.description ?? "" }}
            className="description product-item"
          />
        </div>
      </div>

      <AddToCartDialog onAdd={onAddToCart} />
    </>
  );
}
