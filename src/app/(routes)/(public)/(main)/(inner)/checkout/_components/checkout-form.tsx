"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { inferRouterOutputs } from '@trpc/server';
import { motion as m } from 'framer-motion';
import { BaggageClaimIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CountriesList from '@/components/ui/other/countries-list';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/lib/hooks/use-cart';
import { formatAmount } from '@/lib/utils';
import { OrderDetails, orderDetailsSchema } from '@/lib/zod/checkout';
import { AppRouter } from '@/server/routers';

import { PaymentDialog } from './payment-dialog';

interface CheckoutFormProps {
  countries: inferRouterOutputs<AppRouter>["country"]["get"];
}

export default function CheckoutForm({ countries }: CheckoutFormProps) {
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const cart = useCart();
  const form = useForm<OrderDetails>({
    resolver: zodResolver(orderDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      countryId: 0,
      postalCode: "",
      phoneNumber: "",
      city: "",
      address: "",
    },
  });

  // Handle close payment dialog
  const closePaymentDialog = () => {
    setOpenPaymentDialog(false);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => setOpenPaymentDialog(true))}
          className="space-y-4"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Name field */}
            <m.div style={{ opacity: 0, y: 50 }} className="form-item">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NAME</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your name"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </m.div>

            {/* Email field */}
            <m.div style={{ opacity: 0, y: 50 }} className="form-item">
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
          </div>

          {/* Country field */}
          <div className="grid gap-4 lg:grid-cols-2">
            <m.div style={{ opacity: 0, y: 50 }} className="form-item">
              <FormField
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>COUNTRY</FormLabel>
                    <FormControl>
                      <CountriesList
                        value={field.value}
                        onChange={field.onChange}
                        items={countries}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </m.div>

            {/* Postal code field */}
            <m.div style={{ opacity: 0, y: 50 }} className="form-item">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>POSTAL CODE</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter postal code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </m.div>
          </div>

          {/* Phone number field */}
          <div className="grid gap-4 lg:grid-cols-2">
            <m.div style={{ opacity: 0, y: 50 }} className="form-item">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PHONE NUMBER</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter phone number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </m.div>

            {/* City field */}
            <m.div style={{ opacity: 0, y: 50 }} className="form-item">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CITY</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </m.div>
          </div>

          {/* Address field */}
          <m.div style={{ opacity: 0, y: 50 }} className="form-item">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ADDRESS</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter your address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </m.div>

          {/* Submit button */}
          <m.div
            style={{ opacity: 0, y: 50, scale: 1.2 }}
            className="form-submit-button inline-block origin-center"
          >
            <Button type="submit" size="lg" className="space-x-2">
              <BaggageClaimIcon />
              <span>Place Order ({formatAmount(cart.amount)} USD)</span>
            </Button>
          </m.div>
        </form>
      </Form>

      <PaymentDialog
        open={openPaymentDialog}
        close={closePaymentDialog}
        orderDetails={form.getValues()}
      />
    </>
  );
}
