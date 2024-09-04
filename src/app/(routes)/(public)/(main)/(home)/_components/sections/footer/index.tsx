"use client";

import { motion as m, stagger, useAnimate, useScroll } from "framer-motion";
import { Facebook, Instagram, Mail, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { buttonVariants } from "@/components/ui/button";
import Container from "@/components/ui/other/container";
import Heading from "@/components/ui/other/heading";
import { homeMenu } from "@/data/menu/home";
import { pageRoute } from "@/data/routes";
import { useDevice } from "@/lib/hooks/use-device";
import { cn } from "@/lib/utils";

export default function FooterSection() {
  const { isMediumDevice, isLargeDevice } = useDevice();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end"],
  });
  const [scope, animate] = useAnimate();

  scrollYProgress.on("change", (latest) => {
    if (isLargeDevice && latest > 0.9) {
      animate([
        [".logo", { opacity: 1, y: 0, scale: 1 }],
        [".about", { opacity: 1, y: 0 }],
        [
          ".links-heading, .link",
          { opacity: 1, y: 0 },
          { at: "<", delay: stagger(0.1) },
        ],
        [
          ".contact-item",
          { opacity: 1, y: 0 },
          { at: "<", delay: stagger(0.1) },
        ],
        [".sm-link", { opacity: 1, x: 0 }, { at: "<", delay: stagger(0.1) }],
      ]);
    } else if (isLargeDevice && latest === 0) {
      animate([
        [".logo", { opacity: 0, y: 50, scale: 2 }, { duration: 0.001 }],
        [".about", { opacity: 0, y: 50 }, { at: "<", duration: 0.001 }],
        [
          ".links-heading, .link",
          { opacity: 0, y: 50 },
          { at: "<", delay: stagger(0.1), duration: 0.001 },
        ],
        [
          ".contact-item",
          { opacity: 0, y: 50 },
          { at: "<", delay: stagger(0.1), duration: 0.001 },
        ],
        [
          ".sm-link",
          { opacity: 0, x: 50 },
          { at: "<", delay: stagger(0.1), duration: 0.001 },
        ],
      ]);
    }
  });

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundImage:
          "linear-gradient(hsla(76, 73%, 35%, .8), hsla(76, 73%, 35%, .8)), url(/images/img3.webp)",
        backgroundSize: isMediumDevice ? "175%" : "350%",
        backgroundPosition: "left top",
      }}
      className="grid items-center bg-cover bg-fixed bg-no-repeat py-32"
    >
      <Container className="grid items-center">
        <div ref={scope} className="grid justify-between gap-24 lg:grid-cols-3">
          <div className="">
            <m.div
              style={
                isLargeDevice ? { opacity: 0, y: 50, scale: 2 } : undefined
              }
              className="logo w-full"
            >
              <Image
                src="/images/logo.webp"
                alt="LOGO"
                width={500}
                height={240}
                className="bg-contain"
              />
            </m.div>

            <m.p
              style={isLargeDevice ? { opacity: 0, y: 50 } : undefined}
              className="about mt-8 text-xl text-white/80"
            >
              Introducing our innovative flood-resistant barrier – a versatile
              solution for windows and doors. With a vertically adjustable
              anchor employing a user-friendly jacking system
            </m.p>
          </div>
          <div>
            <m.div
              style={isLargeDevice ? { opacity: 0, y: 50 } : undefined}
              className="links-heading"
            >
              <Heading className="md:text-4xl">Links</Heading>
            </m.div>

            <m.div
              transition={{ staggerChildren: 0.07, delayChildren: 0.2 }}
              className="flex flex-col gap-4"
            >
              {homeMenu.map((item, index) => (
                <m.div
                  key={`menu-item-${index}`}
                  style={isLargeDevice ? { opacity: 0, y: 50 } : undefined}
                  className="link"
                >
                  <Link
                    href={item.href}
                    className="whitespace-nowrap text-xl font-bold text-white/60 hover:text-white"
                  >
                    {item.title}
                  </Link>
                </m.div>
              ))}
              <m.div
                style={isLargeDevice ? { opacity: 0, y: 50 } : undefined}
                className="link"
              >
                <Link
                  href={pageRoute("privacy-policy")}
                  className="whitespace-nowrap text-xl font-bold text-white/60 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </m.div>
              <m.div
                style={isLargeDevice ? { opacity: 0, y: 50 } : undefined}
                className="link"
              >
                <Link
                  href={pageRoute("terms-and-conditions")}
                  className="whitespace-nowrap text-xl font-bold text-white/60 hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </m.div>
            </m.div>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <div className="max-w-xs space-y-4">
              <m.div
                style={isLargeDevice ? { opacity: 0, y: 50 } : undefined}
                className="contact-item flex items-center gap-4"
              >
                <Mail className="text-3xl text-white/80" />
                <p className="text-white/80">customerservice@beavrdam.com</p>
              </m.div>
              <m.div
                style={isLargeDevice ? { opacity: 0, y: 50 } : undefined}
                className="contact-item flex items-center gap-4"
              >
                <Mail className="text-3xl text-white/80" />
                <p className="text-white/80">sales@beavrdam.com</p>
              </m.div>
            </div>

            <div className="bottom-10 flex text-4xl text-white/80">
              <m.div
                style={isLargeDevice ? { opacity: 0, x: 50 } : undefined}
                className="sm-link"
              >
                <Link
                  href="#"
                  className={cn(buttonVariants({ variant: "ghost" }))}
                >
                  <Instagram className="size-6" />
                </Link>
              </m.div>
              <m.div
                style={isLargeDevice ? { opacity: 0, x: 50 } : undefined}
                className="sm-link"
              >
                <Link
                  href="#"
                  className={cn(buttonVariants({ variant: "ghost" }))}
                >
                  <Facebook className="size-6" />
                </Link>
              </m.div>
              <m.div
                style={isLargeDevice ? { opacity: 0, x: 50 } : undefined}
                className="sm-link"
              >
                <Link
                  href="#"
                  className={cn(buttonVariants({ variant: "ghost" }))}
                >
                  <Twitter className="size-6" />
                </Link>
              </m.div>
              <m.div
                style={isLargeDevice ? { opacity: 0, x: 50 } : undefined}
                className="sm-link"
              >
                <Link
                  href="#"
                  className={cn(buttonVariants({ variant: "ghost" }))}
                >
                  <Youtube className="size-6" />
                </Link>
              </m.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
