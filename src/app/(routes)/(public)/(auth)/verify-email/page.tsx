import Image from 'next/image';
import Link from 'next/link';

import { homeRoute } from '@/data/routes';

import Inner from './_component/inner';

export default async function VerifyEmailPage() {
  return (
    <div className="bg-primary">
      <div className="mx-auto flex min-h-screen max-w-screen-2xl items-center justify-center">
        <div className="flex w-full flex-col items-center gap-8 border border-border/50 bg-white px-12 py-16 shadow-xl backdrop-blur-sm sm:w-3/5 sm:rounded-3xl lg:w-2/5">
          {/* Logo */}
          <Link href={homeRoute}>
            <Image
              src="/images/logo.webp"
              alt="Beavr Dam"
              width={242}
              height={57}
              className="w-64"
            />
          </Link>
          <Inner />
        </div>
      </div>
    </div>
  );
}
