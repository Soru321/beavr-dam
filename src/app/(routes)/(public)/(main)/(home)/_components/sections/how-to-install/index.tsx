"use client";

import { motion as m, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Container from '@/components/ui/other/container';
import Heading from '@/components/ui/other/heading';
import { installationSteps } from '@/data/installation-steps';
import { useDevice } from '@/lib/hooks/use-device';
import { cn } from '@/lib/utils';

export default function HowToInstallSection() {
  const { isSmallDevice } = useDevice();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end"],
  });

  const headingOpacity = useTransform(
    scrollYProgress,
    [(isSmallDevice ? 6 : 2) / 16, (isSmallDevice ? 8 : 4) / 16],
    [0, 1],
  );
  const headingLetterSpacing = useTransform(
    scrollYProgress,
    [(isSmallDevice ? 6 : 2) / 16, (isSmallDevice ? 8 : 4) / 16],
    ["6px", "0px"],
  );
  const subHeadingOpacity = useTransform(
    scrollYProgress,
    [(isSmallDevice ? 7 : 3) / 16, (isSmallDevice ? 9 : 5) / 16],
    [0, 1],
  );
  const subHeadingY = useTransform(
    scrollYProgress,
    [(isSmallDevice ? 7 : 3) / 16, (isSmallDevice ? 9 : 5) / 16],
    [50, 0],
  );
  const subHeadingScale = useTransform(
    scrollYProgress,
    [(isSmallDevice ? 7 : 3) / 16, (isSmallDevice ? 9 : 5) / 16],
    [1.2, 1],
  );

  return (
    <section
      id="how-to-install"
      ref={ref}
      className="bg-[hsl(76,73%,35%)] pb-20 pt-20 md:pb-40 md:pt-40"
    >
      <Container>
        <div className="space-y-12">
          <div className="space-y-4">
            {/* Heading */}
            <Heading
              style={{
                opacity: headingOpacity,
                letterSpacing: headingLetterSpacing,
              }}
              className="text-center"
            >
              Easy To Install
            </Heading>

            {/* Text */}
            <m.h4
              style={{
                opacity: subHeadingOpacity,
                y: subHeadingY,
                scale: subHeadingScale,
              }}
              className="mx-auto max-w-2xl text-center text-lg font-semibold text-secondary/80 md:text-2xl"
            >
              Complete the installation effortlessly in just 10 minutes with our
              straightforward 5-step process.
            </m.h4>
          </div>

          {/* Card items */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {installationSteps.map(({ title, description, image }, index) => (
              <Item
                key={`step-${index}`}
                title={title}
                description={description}
                image={image}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

interface ItemProps {
  title: string;
  description: string;
  image: string;
}

function Item({ title, description, image }: ItemProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ amount: 0.8 }}
      transition={{ type: "spring", damping: 15, stiffness: 300 }}
    >
      <Card className="overflow-hidden rounded-3xl shadow-2xl">
        <CardContent className="p-0">
          {/* Image */}
          <Image
            src={image}
            alt="BEAVER DAM"
            width={1280}
            height={729}
            className="object-contain transition hover:scale-110"
          />
          <div className="space-y-1 p-6">
            {/* Title */}
            <h3 className="text-lg font-bold text-primary md:text-xl">
              {title}
            </h3>

            <div className="grid">
              {/* Description */}
              <p
                className={cn(
                  "opacity-60",
                  showFullDescription ? "line-clamp-none" : "line-clamp-4",
                )}
              >
                {description}
              </p>

              {/* Toggle button */}
              <Button
                variant="link"
                onClick={() => setShowFullDescription((prev) => !prev)}
                className="ml-auto"
              >
                see {showFullDescription ? "less" : "more"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </m.div>
  );
}
