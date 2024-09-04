"use client";

import { motion as m, useScroll, useTransform } from "framer-motion";
import { ChevronUp } from "lucide-react";
import Link from "next/link";

export default function ScrollTop() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.1, 0.11], [0, 1]);
  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [64, 0]);

  return (
    <m.div
      style={{ opacity }}
      className="fixed bottom-0 right-0 z-40 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
    >
      <Link href="#home" className="relative z-40">
        <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-lg">
          <ChevronUp strokeWidth={3} className="size-10 text-primary" />
        </div>
      </Link>

      <m.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={64}
        style={{ strokeDashoffset }}
        className="absolute inset-0 size-20 -rotate-90 text-primary"
      >
        <circle cx="12" cy="12" r="10" />
      </m.svg>
    </m.div>
  );
}
