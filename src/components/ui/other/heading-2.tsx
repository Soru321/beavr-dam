"use client";

import { MotionStyle } from "framer-motion";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import Heading from "./heading";

interface HeadingProps {
  children: string | ReactNode;
  className?: string | undefined;
  style?: MotionStyle;
}

export default function Heading2({ children, className, style }: HeadingProps) {
  return (
    <Heading
      style={style}
      className={cn("heading text-2xl text-primary md:text-4xl", className)}
    >
      {children}
    </Heading>
  );
}
