"use client";

import { motion as m, useCycle, useMotionValue, Variants } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { buttonVariants } from "@/components/ui/button";
import { checkoutRoute, homeRoute, productsRoute } from "@/data/routes";
import { useCart } from "@/lib/hooks/use-cart";
import { useDimensions } from "@/lib/hooks/use-dimensions";
import { cn } from "@/lib/utils";

import { Items } from "./items";
import { NavToggle } from "./nav-toggle";

const sideNavbarVariants: Variants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 39px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),

  closed: {
    clipPath: "circle(24px at 39px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

export function SideNavbar() {
  const cart = useCart();
  const [isOpen, toggleOpen] = useCycle(false, true);
  const navHeight = useMotionValue("80px");
  const ref = useRef<HTMLElement>(null);
  const { height } = useDimensions(ref);

  return (
    <>
      <m.nav
        ref={ref}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        style={{ height: navHeight }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        <div className="relative flex h-20 items-center justify-end bg-primary-dark px-4 shadow-lg">
          {/* Logo */}
          <div className="absolute inset-0 left-20 my-auto h-fit w-32 min-[400px]:w-40 min-[500px]:left-0 min-[500px]:mx-auto">
            <Link href={homeRoute}>
              <Image
                src="/images/logo.webp"
                alt="BEAVR DAM"
                width={416}
                height={120}
                className="bg-contain"
                priority
              />
            </Link>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <Link
              href={productsRoute}
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Order
            </Link>
            <Link
              href={checkoutRoute}
              className="ml-auto flex text-xl font-bold text-secondary/80 hover:text-white"
            >
              <ShoppingCart />
              <span className="-translate-x-1 -translate-y-1/2 px-2 text-sm font-bold text-white">
                {cart.items.length}
              </span>
            </Link>
          </div>
        </div>
        <m.div
          variants={sideNavbarVariants}
          onAnimationStart={() => isOpen && navHeight.set("100%")}
          onAnimationComplete={() => !isOpen && navHeight.set("80px")}
          className="absolute inset-0 z-50 bg-white"
        />
        <Items isOpen={isOpen} toggleNav={toggleOpen} />
        <NavToggle toggle={toggleOpen} />
      </m.nav>
    </>
  );
}
