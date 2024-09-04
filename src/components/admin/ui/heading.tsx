"use client";

import { motion as m, MotionStyle } from "framer-motion";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface HeadingProps {
  children: string | ReactNode;
  className?: string | undefined;
  style?: MotionStyle;
}

export default function Heading({ children, className, style }: HeadingProps) {
  return (
    <m.h2
      style={style}
      className={cn(
        "relative whitespace-nowrap text-3xl font-bold text-primary md:text-4xl",
        className,
      )}
    >
      {children}
    </m.h2>
  );
}
