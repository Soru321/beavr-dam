"use client";

import { motion as m } from 'framer-motion';
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { productRoute } from '@/data/routes';
import { useCart } from '@/lib/hooks/use-cart';
import { formatAmount, loadPublicFile } from '@/lib/utils';

export default function Sidebar() {
  const cart = useCart();

  return (
    <div>
      <div className="space-y-4">
        {cart.items.map((item, index) => {
          if (!item.product) return null;

          return (
            <m.div
              key={`item-${index}`}
              style={{ opacity: 0, y: 50, scale: 1.2 }}
              className="sidebar-item"
            >
              <Card className="relative rounded-2xl px-6 py-4 shadow-lg">
                {/* Remove item button */}
                <XIcon
                  onClick={() => cart.removeItem(item.id)}
                  strokeWidth={3}
                  className="absolute right-2 top-2 size-5 cursor-pointer opacity-40 transition hover:scale-125 hover:text-red-500 hover:opacity-100"
                />
                <CardContent className="flex flex-col flex-wrap p-0 sm:flex-row">
                  <div className="sm:w-2/5">
                    {/* Thumbnail */}
                    <Link href={productRoute(item.product.id)} target="_blank">
                      <Image
                        src={loadPublicFile(
                          item.product.productFiles[0].file.path,
                        )}
                        alt="BEAVER DAM"
                        width={5000}
                        height={5000}
                        className="mx-auto aspect-square w-28 rounded-xl object-cover"
                      />
                    </Link>
                  </div>
                  <div className="space-y-1 px-3 py-2 text-center sm:w-3/5 sm:text-left">
                    {/* Title */}
                    <Link href={productRoute(item.product.id)} target="_blank">
                      <h3
                        title={item.product.name}
                        className="line-clamp-1 text-sm font-bold hover:text-primary"
                      >
                        {item.product.name}
                      </h3>
                    </Link>

                    {/* Short description */}
                    <p
                      title={item.product.shortDescription ?? ""}
                      className="line-clamp-1 text-sm opacity-60"
                    >
                      {item.product.shortDescription}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm">Quantity:</span>
                      <div className="flex items-center">
                        <button
                          disabled={item.quantity === 1}
                          onClick={() => cart.decrementQuantity(item.id)}
                          className="rounded-sm border p-0.5"
                        >
                          <MinusIcon className="size-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => cart.incrementQuantity(item.id)}
                          className="rounded-sm border p-0.5"
                        >
                          <PlusIcon className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <p className="text-sm">
                      Price:{" "}
                      <span className="font-bold">
                        {formatAmount(item.amount)}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </m.div>
          );
        })}
      </div>

      {!!cart.items.length && (
        <m.div style={{ width: "0%" }} className="separator">
          <Separator className="my-6" />
        </m.div>
      )}

      {/* Total */}
      <m.div
        style={{ opacity: 0 }}
        className="sidebar-total flex justify-between text-xl font-bold"
      >
        <h3>Total</h3>
        <h3>{formatAmount(cart.amount)}</h3>
      </m.div>
    </div>
  );
}
