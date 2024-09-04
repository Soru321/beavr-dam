"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { inferRouterOutputs } from '@trpc/server';
import { UserRoundCogIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';

import { trpcClient } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Profile, profileSchema } from '@/lib/zod/admin/profile';
import { AppRouter } from '@/server/routers';

interface ProfileFormProps {
  user: inferRouterOutputs<AppRouter>["auth"]["getCurrent"];
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const form = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });
  const updateProfile = trpcClient.admin.user.updateProfile.useMutation();

  const onSubmit = (formValues: Profile) => {
    updateProfile.mutateAsync(formValues, {
      onSuccess: ({ messages }) => {
        for (const message of messages) {
          toast.success(message, { duration: 10 * 1000 });
        }

        form.resetField("email");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NAME</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button
          type="submit"
          size="lg"
          disabled={updateProfile.isPending}
          className="space-x-2"
        >
          {updateProfile.isPending ? (
            <BeatLoader color="#fff" />
          ) : (
            <>
              <UserRoundCogIcon />
              <span className="text-lg font-semibold">Update</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
