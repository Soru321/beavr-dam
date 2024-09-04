"use client";

import "@/styles/jodit.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { inferRouterOutputs } from "@trpc/server";
import { ShieldCheckIcon, ShieldPlusIcon } from "lucide-react";
import dynamic from "next/dynamic";
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
import { Switch } from "@/components/ui/switch";
import { Page, pageSchema } from "@/lib/zod/admin/page";
import { AppRouter } from "@/server/routers";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface PageFormProps {
  pageSlug: string;
  page: inferRouterOutputs<AppRouter>["admin"]["page"]["getBySlug"];
}

export default function PageForm({ pageSlug, page }: PageFormProps) {
  const router = useRouter();

  const form = useForm<Page>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      slug: page?.slug ?? pageSlug,
      content: page?.content ?? "",
      status: page?.status ?? true,
    },
  });
  const createOrUpdate = trpcClient.admin.page.createOrUpdate.useMutation();

  const onSubmit = (formValues: Page) => {
    createOrUpdate.mutate(formValues, {
      onSuccess: ({ message }) => {
        toast.success(message);
        router.refresh();
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PAGE CONTENT</FormLabel>
              <FormControl>
                <JoditEditor
                  value={field.value}
                  onBlur={(newContent) => field.onChange(newContent)}
                  config={{ height: 700 }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PAGE STATUS</FormLabel>
              <FormControl className="block">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={createOrUpdate.isPending}
          className="space-x-2"
        >
          {createOrUpdate.isPending ? (
            <BeatLoader color="#fff" />
          ) : (
            <>
              {!!page ? <ShieldCheckIcon /> : <ShieldPlusIcon />}
              <span>{!!page ? "Update" : "Create"}</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
