"use client";

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';

import { trpcClient } from '@/app/_trpc/client';
import { buttonVariants } from '@/components/ui/button';
import { homeRoute, signInRoute } from '@/data/routes';
import { cn } from '@/lib/utils';

export default function Inner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const verifyEmail = trpcClient.auth.verifyEmail.useMutation();

  // Handle submission
  const onSubmit = useCallback(() => {
    if (!email || !token) {
      return toast.error("Invalid token!");
    }

    verifyEmail.mutate(
      { email, token },
      {
        onSuccess: async ({ message }) => {
          toast.success(message, { duration: 10 * 1000 });
          await signOut({ redirect: false });
          router.replace(signInRoute());
        },
        onError: ({ message, data }) => {
          toast.error(message, {
            duration: !!data?.cause ? 10 * 1000 : 5 * 1000,
          });
        },
      },
    );

    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xl">
        {verifyEmail.isPending ? "Verifying" : "Verify"} your email
      </p>
      {verifyEmail.isPending && <PropagateLoader size={20} color="#99c620" />}
      <Link
        href={homeRoute}
        className={cn(
          buttonVariants({ variant: "default" }),
          verifyEmail.isPending && "mt-8",
        )}
      >
        Go to Home
      </Link>
    </div>
  );
}
