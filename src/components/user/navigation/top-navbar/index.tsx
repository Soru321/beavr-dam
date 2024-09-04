"use client";

import {
  animate,
  motion as m,
  MotionStyle,
  useMotionValue,
  useScroll,
} from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { homeMenu } from "@/data/menu/home";
import { homeRoute } from "@/data/routes";
import { useCart } from "@/lib/hooks/use-cart";
import { cn } from "@/lib/utils";

export function TopNavbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const y = useMotionValue("-100%");

  // Handle sticky nav
  scrollY.on("change", async (latest) => {
    if (pathname !== homeRoute) return;

    if (latest > 300) {
      animate(y, "0%", { duration: 0.1 });
    } else if (latest < 300) {
      animate(y, "-100%", { duration: 0.1 });
    }
  });

  return (
    <>
      {/* Sticky nav */}
      <Nav
        key={`animated-nav-${pathname}`}
        style={{ position: "fixed", y: pathname === homeRoute ? y : "0%" }}
        className="h-20 bg-primary-dark shadow-lg"
        logoClassName="w-40"
      />

      {/* Static nav */}
      {pathname === homeRoute && (
        <Nav key="static-nav" style={{ position: "absolute" }} />
      )}
    </>
  );
}

interface NavProps {
  style: MotionStyle;
  className?: string;
  logoClassName?: string;
}

function Nav({ style, className, logoClassName }: NavProps) {
  const cart = useCart();
  const scale = useMotionValue(1);

  useEffect(() => {
    animate(scale, [1.5, 1], { duration: 0.5, type: "tween", ease: "linear" });
  }, [scale, cart.items]);

  return (
    <m.nav
      style={style}
      className={cn(
        "left-0 top-0 z-40 flex h-40 w-full items-center justify-center p-8",
        className,
      )}
    >
      <div className="flex w-full max-w-screen-xl items-center justify-between">
        {/* Logo */}
        <div className={cn("w-80", logoClassName)}>
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

        <div className="flex items-center gap-10">
          {/* Links */}
          {homeMenu.map(({ title, href }, index) => (
            <Link
              key={`menu-item-${index}`}
              href={href}
              className="text-xl font-bold text-secondary/80 hover:text-white"
            >
              {title}
            </Link>
          ))}

          {/* Cart link */}
          <m.div style={{ scale }}>
            <Link
              href="/checkout"
              className="flex text-xl font-bold text-secondary/80 hover:text-white"
            >
              <ShoppingCart />
              <span className="-translate-x-1 -translate-y-1/2 px-2 text-sm font-bold text-white">
                {cart.items.length}
              </span>
            </Link>
          </m.div>
        </div>
      </div>
    </m.nav>
  );
}
