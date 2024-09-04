import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import '@/styles/swiper-styles.css';
import '@/styles/react-inner-image-zoom.css';

import { inferRouterOutputs } from '@trpc/server';
import { motion as m } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import ReactInnerImageZoom from 'react-inner-image-zoom';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as TSwiper } from 'swiper/types';

import { loadPublicFile } from '@/lib/utils';
import { AppRouter } from '@/server/routers';

interface CarouselProps {
  product: inferRouterOutputs<AppRouter>["product"]["getById"];
}

export default function Carousel({ product }: CarouselProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<TSwiper | null>(null);

  return (
    <m.div style={{ opacity: 0, x: -50 }} className="product-images">
      <Swiper
        loop={true}
        navigation={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {product?.productFiles.map((item) => (
          <SwiperSlide
            key={`product-image-${item.id}`}
            className="!flex items-center justify-center"
          >
            <ReactInnerImageZoom
              src={loadPublicFile(item.file.path)}
              zoomType="hover"
              className="rounded-2xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {!!product && product.productFiles.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbnail-swiper mt-4"
        >
          {product?.productFiles.map((item) => (
            <SwiperSlide key={`product-image-${item.id}`}>
              <Image
                src={loadPublicFile(item.file.path)}
                alt="Product Image"
                width={500}
                height={500}
                className="aspect-square rounded-lg object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </m.div>
  );
}
