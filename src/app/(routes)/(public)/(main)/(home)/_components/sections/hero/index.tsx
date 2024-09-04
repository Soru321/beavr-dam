"use client";

import { motion as m, stagger, useAnimate } from 'framer-motion';
import Image from 'next/image';
import { useLayoutEffect } from 'react';

import Container from '@/components/ui/other/container';
import { useDevice } from '@/lib/hooks/use-device';

export default function HeroSection() {
  const [scope, animate] = useAnimate<HTMLElement>();
  const { isMediumDevice } = useDevice();

  useLayoutEffect(() => {
    animate([
      [
        ".heading, .tagline, .para",
        { opacity: 1, y: 0 },
        { delay: stagger(0.2), duration: 0.5 },
      ],
      [".image", { opacity: 1, x: 0, y: 0 }, { at: "<", duration: 0.5 }],
      [".button", { opacity: 1, y: 1, scale: 1 }, { delay: 0.3 }],
    ]);
  }, [animate]);

  return (
    <section
      id="home"
      ref={scope}
      style={{
        backgroundImage:
          "linear-gradient(hsla(76, 73%, 35%, .8), hsla(76, 73%, 35%, .8)), url(/images/img3.webp)",
        backgroundSize: isMediumDevice ? "120%" : "350%",
        backgroundPosition: "left center",
      }}
      className="flex min-h-screen items-center bg-cover bg-fixed bg-no-repeat"
    >
      <Container className="">
        <div className="flex flex-col-reverse gap-20 py-20 md:flex-row md:gap-0 md:py-0">
          <div className="flex flex-col justify-center md:w-1/2">
            {/* Heading */}
            <m.h1
              style={{ opacity: 0, y: 50 }}
              className="heading overflow-hidden text-5xl font-bold text-white lg:text-6xl"
            >
              Beavr Dam:
              <br /> Guardian of Homes
            </m.h1>

            {/* Sub heading */}
            <m.h3
              style={{ opacity: 0, y: 50 }}
              className="tagline mt-2 text-3xl font-bold text-white/80"
            >
              Flood Gate System
            </m.h3>

            {/* Text */}
            <m.p
              style={{ opacity: 0, y: 50 }}
              className="para mt-4 text-2xl text-white/80"
            >
              Protecting Doorsteps One Flood at a Time!
            </m.p>
          </div>

          {/* Animated image */}
          <m.div
            style={{
              opacity: 0,
              x: isMediumDevice ? 100 : 0,
              y: isMediumDevice ? 0 : 100,
            }}
            className="image md:w-1/2"
          >
            <Image
              src="/images/beaver.webp"
              alt={process.env.NEXT_PUBLIC_APP_NAME}
              width={2850}
              height={3600}
              priority
              className="object-contain"
            />
          </m.div>
        </div>
      </Container>
    </section>
  );
}
