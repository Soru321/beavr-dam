"use client";

import { inferRouterOutputs } from '@trpc/server';
import { ShoppingCartIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { productRoute } from '@/data/routes';
import { useAddToCartDialog } from '@/lib/hooks/use-add-to-cart-dialog';
import { cn, loadPublicFile } from '@/lib/utils';
import { AppRouter } from '@/server/routers';

type Product = inferRouterOutputs<AppRouter>["product"]["get"][0];

interface ProductCardProps {
  item: Product;
  className?: string;
}

export default function ProductCard({ item, className }: ProductCardProps) {
  const addToCartDialog = useAddToCartDialog();

  return (
    <Card
      className={cn("overflow-hidden rounded-3xl lg:shadow-2xl", className)}
    >
      <CardContent className="p-0">
        {/* Image */}
        <Link href={productRoute(item.id)} className="relative !block !h-80">
          <Image
            src={loadPublicFile(item.productFiles[0].file.path)}
            alt="BEAVER DAM"
            fill
            className="object-cover"
          />
        </Link>
        <div className="p-6">
          {/* Title */}
          <Link href={productRoute(item.id)}>
            <h3 className="text-lg font-bold text-primary md:text-xl">
              {item.name}
            </h3>
          </Link>

          {/* Description */}
          <p
            className="mt-1 line-clamp-2 opacity-60"
            title={item.shortDescription ?? ""}
          >
            {item.shortDescription}
          </p>

          <div className="mt-4 flex items-center justify-between">
            {/* Price */}
            <p className="text-lg font-bold text-primary md:text-xl">
              ${item.price}
            </p>

            {/* Add to cart button */}
            <Button
              size="lg"
              onClick={() => addToCartDialog.open(item.id)}
              className="space-x-2"
            >
              <ShoppingCartIcon />
              <span>Add to cart</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
