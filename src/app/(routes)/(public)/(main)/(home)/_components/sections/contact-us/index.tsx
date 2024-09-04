"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { motion as m } from 'framer-motion';
import { Facebook, Instagram, Mail, SendIcon, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';

import { trpcClient } from '@/app/_trpc/client';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Container from '@/components/ui/other/container';
import Heading from '@/components/ui/other/heading';
import { Textarea } from '@/components/ui/textarea';
import { useDevice } from '@/lib/hooks/use-device';
import { cn } from '@/lib/utils';
import { ContactUs, contactUsSchema } from '@/lib/zod/contact-us';

export default function ContactUsSection() {
  const { isMediumDevice } = useDevice();
  const form = useForm<ContactUs>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: { name: "", email: "", message: "" },
  });
  const sendMessage = trpcClient.contact.send.useMutation();

  // Handle form submission
  const onSubmit = (formValues: ContactUs) => {
    sendMessage.mutate(formValues, {
      onSuccess: ({ message }) => {
        toast.success(message, { duration: 10000 });
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <section id="contact-us">
      <Container className="mx-auto my-6 w-full">
        <div className="space-y-12">
          {/* Heading */}
          <Heading className="whitespace-nowrap text-center text-primary">
            Contact Us
          </Heading>

          <div className="mt-8 grid items-center gap-4 rounded-xl border-[1px] border-border bg-white shadow-lg lg:grid-cols-3">
            <div
              style={{
                backgroundImage:
                  "linear-gradient(hsla(76, 73%, 35%, .8), hsla(76, 73%, 35%, .8)), url(/images/img3.webp)",
                backgroundSize: isMediumDevice ? "175%" : "300%",
                backgroundPosition: "left center",
              }}
              className="flex h-full flex-col justify-between gap-12 rounded-xl bg-cover bg-fixed bg-no-repeat p-8"
            >
              <div>
                {/* Heading */}
                <h3 className="text-2xl font-bold text-white md:text-3xl">
                  Contact Information
                </h3>

                {/* Text */}
                <p className="mt-3 text-white/80">
                  {
                    "We're here to help and answer any question you might have. We look forward to hearing from you."
                  }
                </p>
              </div>

              {/* Emails */}
              <div className="flex flex-col gap-8">
                <div className="max-w-xs space-y-4">
                  <m.div
                    style={{ opacity: 1, y: 0 }}
                    className="contact-item flex items-center gap-4"
                  >
                    <Mail className="text-3xl text-white/80" />
                    <p className="text-white/80">
                      customerservice@beavrdam.com
                    </p>
                  </m.div>
                  <m.div
                    style={{ opacity: 1, y: 0 }}
                    className="contact-item flex items-center gap-4"
                  >
                    <Mail className="text-3xl text-white/80" />
                    <p className="text-white/80">sales@beavrdam.com</p>
                  </m.div>
                </div>

                {/* Social media handles */}
                <div className="flex text-4xl text-white/80">
                  <m.div style={{ opacity: 1, x: 0 }} className="sm-link">
                    <Link
                      href="#"
                      className={cn(buttonVariants({ variant: "ghost" }))}
                    >
                      <Instagram className="size-6" />
                    </Link>
                  </m.div>
                  <m.div style={{ opacity: 1, x: 0 }} className="sm-link">
                    <Link
                      href="#"
                      className={cn(buttonVariants({ variant: "ghost" }))}
                    >
                      <Facebook className="size-6" />
                    </Link>
                  </m.div>
                  <m.div style={{ opacity: 1, x: 0 }} className="sm-link">
                    <Link
                      href="#"
                      className={cn(buttonVariants({ variant: "ghost" }))}
                    >
                      <Twitter className="size-6" />
                    </Link>
                  </m.div>
                  <m.div style={{ opacity: 1, x: 0 }} className="sm-link">
                    <Link
                      href="#"
                      className={cn(buttonVariants({ variant: "ghost" }))}
                    >
                      <Youtube className="size-6" />
                    </Link>
                  </m.div>
                </div>
              </div>
            </div>

            <div className="p-12 px-8 lg:col-span-2">
              {/* Contact form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Name field */}
                  <m.div style={{ opacity: 1, y: 0 }}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NAME</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </m.div>

                  {/* Email field */}
                  <m.div style={{ opacity: 1, y: 0 }}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>EMAIL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </m.div>

                  {/* Message field */}
                  <m.div style={{ opacity: 1, y: 0 }}>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>MESSAGE</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Enter message" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </m.div>

                  {/* Submit button */}
                  <m.div
                    style={{ opacity: 1, y: 0, scale: 1 }}
                    className="form-submit-button origin-left"
                  >
                    <Button
                      type="submit"
                      size="lg"
                      disabled={sendMessage.isPending}
                      className="space-x-2"
                    >
                      {sendMessage.isPending ? (
                        <BeatLoader color="#fff" />
                      ) : (
                        <>
                          <SendIcon />
                          <span>Send Message</span>
                        </>
                      )}
                    </Button>
                  </m.div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
