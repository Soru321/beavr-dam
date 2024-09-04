"use client";

import 'swiper/css';
import 'swiper/css/navigation';
import '@/styles/swiper-styles.css';
import '@/styles/react-inner-image-zoom.css';

import { inferRouterOutputs } from '@trpc/server';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { AddToCartDialog } from '@/components/ui/other/add-to-cart-dialog';
import ProductCard from '@/components/user/product-card';
import { useCart } from '@/lib/hooks/use-cart';
import { useDevice } from '@/lib/hooks/use-device';
import { generateRandomString } from '@/lib/utils';
import { AppRouter } from '@/server/routers';

type Product = inferRouterOutputs<AppRouter>["product"]["get"][0];

interface ListProps {
  products: Product[];
}

export default function List({ products }: ListProps) {
  const { isMediumDevice } = useDevice();
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

  if (isMediumDevice) {
    return (
      <>
        {products.map((item, index) => (
          <ProductCard key={`product-${index}`} item={item} />
        ))}

        <AddToCartDialog onAdd={onAddToCart} />
      </>
    );
  }

  return (
    <>
      {/* Slider */}
      <Swiper loop={true} navigation={true} modules={[Navigation]}>
        {products.map((item, index) => (
          <SwiperSlide
            key={`product-${index}`}
            className="!flex w-full items-center justify-center"
          >
            <ProductCard item={item} className="w-full" />
          </SwiperSlide>
        ))}
      </Swiper>

      <AddToCartDialog onAdd={onAddToCart} />
    </>
  );
}
