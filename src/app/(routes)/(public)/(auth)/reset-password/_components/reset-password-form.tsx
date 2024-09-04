"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MdLockReset } from 'react-icons/md';
import { BeatLoader } from 'react-spinners';

import { trpcClient } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/other/password-input';
import { signInRoute } from '@/data/routes';
import { ResetPassword, resetPasswordSchema } from '@/lib/zod/auth';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const form = useForm<ResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const resetPassword = trpcClient.auth.resetPassword.useMutation();

  // Handle form submission
  const onSubmit = async (formValues: ResetPassword) => {
    if (!email || !token) {
      return toast.error("Invalid token!");
    }

    resetPassword.mutate(
      { ...formValues, email, token },
      {
        onSuccess: ({ message }) => {
          toast.success(message, { duration: 10 * 1000 });
          router.push(signInRoute());
        },
        onError: ({ message, data }) => {
          toast.error(message, {
            duration: !!data?.cause ? 10 * 1000 : 5 * 1000,
          });
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Password field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PASSWORD</FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder="Enter password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm password field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CONFIRM PASSWORD</FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder="Enter password again" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between gap-4">
          {/* Submit button */}
          <Button
            type="submit"
            size="lg"
            disabled={resetPassword.isPending}
            className="space-x-2"
          >
            {resetPassword.isPending ? (
              <BeatLoader color="#fff" />
            ) : (
              <>
                <MdLockReset className="size-8" />
                <span>RESET PASSWORD</span>
              </>
            )}
          </Button>

          {/* Sign in link */}
          <Link href={signInRoute()} className="text-primary">
            {"I already have an account"}
          </Link>
        </div>
      </form>
    </Form>
  );
}
