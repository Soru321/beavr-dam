"use client";

import { motion as m, stagger, useAnimate, useScroll, useTransform, Variants } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { useDevice } from '@/lib/hooks/use-device';

const paraVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
    },
  },
};
const paraViewport = { amount: 0.4 };

export default function InnerSection1() {
  const { isLargeDevice } = useDevice();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start"],
  });
  const [contentScope, animateContent] = useAnimate<HTMLDivElement>();

  const imageOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  const imageScale = useTransform(scrollYProgress, [0.6, 0.7], [4, 1]);
  const imageX = useTransform(scrollYProgress, [0.65, 0.75], [300, 0]);
  imageX.on("change", (latest) => {
    if (isLargeDevice && latest === 0) {
      animateContent([
        [contentScope.current, { scale: 1 }],
        [".para", { opacity: 1, y: 0 }, { delay: stagger(0.2) }],
      ]);
    } else if (isLargeDevice && latest > imageX.getPrevious()) {
      animateContent([
        [contentScope.current, { scale: 0 }, { duration: 0.1 }],
        [".para", { opacity: 0, y: 50 }, { duration: 0.1 }],
      ]);
    }
  });

  return (
    <div ref={ref} className="flex">
      {/* Animated image */}
      {isLargeDevice && (
        <m.div
          style={{ opacity: imageOpacity, x: imageX, scale: imageScale }}
          className=""
        >
          <Image
            src="/images/beaver.webp"
            alt="BEAVER DAM"
            width={5000}
            height={5000}
            priority
            className="w-96 object-contain"
          />
        </m.div>
      )}

      {/* Content */}
      <m.div
        ref={contentScope}
        style={{ scale: isLargeDevice ? 0 : 1 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.2 }}
        className="mx-auto origin-top-left space-y-6 rounded-3xl bg-white p-8 text-lg text-primary-dark sm:p-16 sm:text-xl md:rounded-[80px] lg:w-4/5 lg:space-y-12 xl:text-3xl"
      >
        <m.p
          variants={paraVariants}
          initial="hidden"
          whileInView="whileInView"
          viewport={paraViewport}
          className="para"
        >
          Introducing our innovative flood-resistant barrier – a versatile
          solution for windows and doors. With a vertically adjustable anchor
          employing a user-friendly jacking system, our product ensures easy
          installation in any opening frame. The flood gates, equipped with
          water impermeable panels, not only attach securely to the anchors but
          also offer lateral expansion, creating a tight seal with the sides and
          bottom of the opening.
        </m.p>
        <m.p
          variants={paraVariants}
          initial="hidden"
          whileInView="whileInView"
          viewport={paraViewport}
          className="para"
        >
          Our design includes an enhanced peripheral seal, significantly
          reducing the risk of leakage at the corners. For wider openings, the
          modular nature allows the assembly of multiple flood gates adjacent to
          each other, providing comprehensive flood protection. Invest in peace
          of mind with our adjustable flood-resistant barrier – where
          reliability meets adaptability.
        </m.p>
      </m.div>
    </div>
  );
}
