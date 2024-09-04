"use client";

import { inferRouterOutputs } from '@trpc/server';
import { motion as m, stagger, useAnimate } from 'framer-motion';
import { ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';
import { useLayoutEffect } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Heading2 from '@/components/ui/other/heading-2';
import { productsRoute } from '@/data/routes';
import { useCart } from '@/lib/hooks/use-cart';
import { cn } from '@/lib/utils';
import { AppRouter } from '@/server/routers';

import CheckoutForm from './checkout-form';
import Sidebar from './sidebar';

interface InnerProps {
  countries: inferRouterOutputs<AppRouter>["country"]["get"];
}

export default function Inner({ countries }: InnerProps) {
  const cart = useCart();
  const [scope, animate] = useAnimate();

  useLayoutEffect(() => {
    animate([
      [".heading", { opacity: 1, letterSpacing: "0px" }, { duration: 0.5 }],
      [".card", { opacity: 1, scale: 1 }, { at: "<" }],
      "form-label",
      [".form-item", { opacity: 1, y: 0 }, { delay: stagger(0.1) }],
      [".form-submit-button", { opacity: 1, y: 0, scale: 1 }],
      [
        ".sidebar-item",
        { opacity: 1, y: 0, scale: 1 },
        { at: "<", delay: stagger(0.1) },
      ],
      [".separator", { width: "100%" }],
      [".sidebar-total", { opacity: 1 }],
    ]);
  }, [animate, cart.items]);

  return (
    <div ref={scope} className="w-full">
      {!cart.items.length ? (
        <EmptyCart />
      ) : (
        <div>
          {/* Heading */}
          <Heading2
            style={{ opacity: 0, letterSpacing: "15px" }}
            className="heading text-5xl text-primary"
          >
            Checkout
          </Heading2>
          <m.div style={{ opacity: 0, scale: 0.8 }} className="card">
            <Card className="rounded-3xl shadow-xl">
              <CardContent className="flex flex-col p-0 md:flex-row">
                <div className="border-b border-r-0 p-8 md:w-1/2 md:border-b-0 md:border-r lg:w-3/5 xl:w-2/3">
                  <CheckoutForm countries={countries} />
                </div>
                <div className="p-8 md:w-1/2 lg:w-2/5 xl:w-1/3">
                  <Sidebar />
                </div>
              </CardContent>
            </Card>
          </m.div>
        </div>
      )}
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex h-screen flex-col items-center gap-6">
      <ShoppingCartIcon className="size-48 text-primary" />
      <p className="text-3xl">Your card is empty</p>
      <Link
        href={productsRoute}
        className={cn(buttonVariants({ variant: "default" }))}
      >
        Click here to add products
      </Link>
    </div>
  );
}
