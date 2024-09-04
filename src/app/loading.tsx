"use client";

import Image from "next/image";
import { BarLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="grid h-screen items-center justify-center">
      <div className="w-80 space-y-4">
        <Image
          src="/images/logo.webp"
          alt="BEAVR DAM"
          width={416}
          height={120}
          className="object-contain"
          priority
        />

        <BarLoader width={320} color="hsl(var(--primary))" loading />
      </div>
    </div>
  );
}
