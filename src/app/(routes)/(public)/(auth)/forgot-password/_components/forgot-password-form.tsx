"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MdLockReset } from 'react-icons/md';
import { BeatLoader } from 'react-spinners';

import { trpcClient } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { homeRoute, signInRoute } from '@/data/routes';
import { ForgotPassword, forgotPasswordSchema } from '@/lib/zod/auth';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const form = useForm<ForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const resetPassword = trpcClient.auth.sendResetPasswordLink.useMutation();

  // Handle form submission
  const onSubmit = async (formValues: ForgotPassword) => {
    resetPassword.mutate(formValues, {
      onSuccess: ({ message }) => {
        toast.success(message, { duration: 10000 });
        router.push(homeRoute);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>EMAIL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter email" />
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
