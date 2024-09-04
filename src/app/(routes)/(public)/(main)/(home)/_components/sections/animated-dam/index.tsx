"use client";

import { motion as m } from "framer-motion";
import Image from "next/image";

import Container from "@/components/ui/other/container";

export default function AnimatedDamSection() {
  return (
    <section className="bg-[hsl(76,73%,35%)] py-20">
      <Container>
        <m.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ amount: 0.5 }}
          className="relative z-20"
        >
          <Image
            src="/images/beavr-dam.gif"
            alt={process.env.NEXT_PUBLIC_APP_NAME}
            width={850}
            height={490}
            className="w-full rounded-3xl"
          />
        </m.div>
      </Container>
    </section>
  );
}
