"use client";

import { motion as m, useScroll, useTransform, Variants } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { useDevice } from '@/lib/hooks/use-device';

const paraVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0, transition: { type: "tween" } },
};

export default function InnerSection2() {
  const { isLargeDevice } = useDevice();

  const firstImageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: firstImageScrollYProgress } = useScroll({
    target: firstImageRef,
    offset: ["end 90%", "start"],
  });
  const secondImageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: secondImageScrollYProgress } = useScroll({
    target: firstImageRef,
    offset: ["end", "start"],
  });

  const firstImageOpacity = useTransform(
    firstImageScrollYProgress,
    [0.1, 0.2],
    [0, 1],
  );
  const firstImageY = useTransform(
    firstImageScrollYProgress,
    [0.1, 0.2, 1],
    [50, 0, -150],
  );
  const secondImageOpacity = useTransform(
    secondImageScrollYProgress,
    [0.1, 0.2],
    [0, 1],
  );

  return (
    <div className="flex flex-col gap-12 lg:flex-row">
      {/* Images */}
      <div className="relative h-60 lg:h-[400px] lg:w-1/2">
        <m.div
          ref={firstImageRef}
          style={{ opacity: firstImageOpacity, y: firstImageY }}
          className="absolute left-0 top-0 z-10 h-40 w-2/3 sm:h-60 lg:h-72"
        >
          <Image
            src="/images/img1.webp"
            alt="Image"
            fill
            className="rounded-2xl object-cover"
          />
        </m.div>
        <m.div
          ref={secondImageRef}
          style={{ opacity: secondImageOpacity }}
          className="absolute bottom-0 right-0 h-40 w-2/3 sm:h-60 lg:h-72"
        >
          <Image
            src="/images/img2.webp"
            alt="Image"
            fill
            className="rounded-2xl object-cover"
          />
        </m.div>
      </div>

      {/* Content */}
      <div className="space-y-6 lg:w-1/2">
        <m.p
          variants={paraVariants}
          initial="hidden"
          whileInView="whileInView"
          viewport={{ amount: isLargeDevice ? 1 : 0.5 }}
          className="text-xl text-secondary/80"
        >
          Experience unparalleled versatility with our adjustable
          flood-resistant barrier, designed to safeguard both doors and windows.
          The vertically adjustable anchor, coupled with a user-friendly jacking
          system, seamlessly integrates into various opening frames, offering a
          universal solution for different entry points in your space.
        </m.p>
        <m.p
          variants={paraVariants}
          initial="hidden"
          whileInView="whileInView"
          viewport={{ amount: isLargeDevice ? 1 : 0.5 }}
          className="text-xl text-secondary/80"
        >
          What sets our product apart is its groundbreaking stackable flood gate
          feature – a first in the market. Now, you can address wide openings
          with ease by assembling multiple flood gates side by side. Each gate,
          equipped with water impermeable panels, ensures a secure fit, and the
          lateral expansion capability allows for a customized, water-tight seal
          with the sides and bottom of any opening.
        </m.p>
      </div>
    </div>
  );
}
