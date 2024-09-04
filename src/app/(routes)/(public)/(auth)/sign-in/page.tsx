import { UserRoundCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { homeRoute } from '@/data/routes';
import { dashboardRoute as adminDashboardRoute } from '@/data/routes/admin';
import { Role } from '@/lib/types/auth';
import { getServerAuthSession } from '@/server/auth';

import SignInForm from './_components/sign-in-form';

export default async function SignInPage() {
  const session = await getServerAuthSession();

  if (!!session && !!session.user) {
    redirect(
      session.user.role === ("ADMIN" as Role) ? adminDashboardRoute : homeRoute,
    );
  }

  return (
    <div className="sm:bg-primary">
      <div className="mx-auto flex min-h-screen max-w-screen-2xl items-center justify-center">
        <div className="flex h-full w-full flex-col gap-2 border-border/50 bg-white px-4 py-16 backdrop-blur-sm sm:w-11/12 sm:gap-16 sm:rounded-3xl sm:border sm:px-12 sm:shadow-xl md:w-3/5 lg:w-11/12 lg:flex-row xl:w-[70%]">
          <div className="mx-auto sm:mx-0 lg:w-1/2">
            <div className="space-y-4">
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

              {/* Text */}
              <p className="hidden font-semibold sm:block">
                A versatile solution for windows and doors. With a vertically
                adjustable anchor employing a user-friendly jacking system, our
                product ensures easy installation in any opening frame.
              </p>
            </div>
          </div>
          <div className="space-y-8 lg:w-1/2">
            <h2 className="flex items-center justify-center gap-1 sm:justify-start">
              <UserRoundCheck className="text-primary" />
              <span className="text-xl font-semibold">SIGN IN TO CONTINUE</span>
            </h2>
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
}
