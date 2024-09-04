"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { LogInIcon } from 'lucide-react';
import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';

import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/other/password-input';
import { INTERNAL_SERVER_ERROR } from '@/data/error-messages';
import { forgotPasswordRoute, homeRoute } from '@/data/routes';
import { admin, dashboardRoute as adminDashboardRoute } from '@/data/routes/admin';
import { Role } from '@/lib/types/auth';
import { SignIn, signInSchema } from '@/lib/zod/auth';

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const form = useForm<SignIn>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  // Handle form submission
  const onSubmit = async ({ email, password }: SignIn) => {
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // Handle signin error
      if (!!res?.error) {
        setLoading(false);
        toast.error(res.error);
        return;
      }

      const callbackUrlString =
        searchParams.get("callbackUrl") ?? process.env.NEXT_PUBLIC_APP_URL;
      const callbackUrl = new URL(callbackUrlString);

      const session = await getSession();
      // Redirect based on role
      if (session?.user.role === ("ADMIN" as Role)) {
        router.replace(
          callbackUrl.pathname.startsWith(admin)
            ? callbackUrlString
            : adminDashboardRoute,
        );
      } else {
        router.replace(
          callbackUrl.pathname.startsWith(admin)
            ? homeRoute
            : callbackUrlString,
        );
      }
    } catch (error) {
      toast.error(INTERNAL_SERVER_ERROR);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid space-y-4">
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

        {/* Forgot password link */}
        <Link href={forgotPasswordRoute} className="ml-auto text-primary">
          Forgot Password
        </Link>

        {/* Submit button */}
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="space-x-2 justify-self-start"
        >
          {loading ? (
            <BeatLoader color="#fff" />
          ) : (
            <>
              <LogInIcon />
              <span>SIGN IN</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
