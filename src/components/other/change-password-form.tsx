"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyholeIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

import { trpcClient } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/other/password-input";
import { signInRoute } from "@/data/routes";
import { ChangePassword, changePasswordSchema } from "@/lib/zod/auth";

export default function ChangePasswordForm() {
  const router = useRouter();
  const form = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const changePassword = trpcClient.auth.changePassword.useMutation();

  // Handle form submission
  const onSubmit = (formValues: ChangePassword) => {
    changePassword.mutate(formValues, {
      onSuccess: async ({ message }) => {
        toast.success(message, { duration: 10 * 1000 });
        await signOut({ redirect: false });
        router.push(signInRoute());
      },
      onError: ({ message }) => toast.error(message),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 space-y-4">
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
                <PasswordInput
                  {...field}
                  placeholder="Enter confirm password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button
          type="submit"
          size="lg"
          disabled={changePassword.isPending}
          className="space-x-2"
        >
          {changePassword.isPending ? (
            <BeatLoader color="#fff" />
          ) : (
            <>
              <LockKeyholeIcon />
              <span className="text-lg font-semibold">Change</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
