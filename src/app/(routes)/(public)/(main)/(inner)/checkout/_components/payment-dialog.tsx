import { OnApproveData } from '@paypal/paypal-js/types/components/buttons';
import { FUNDING, PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';

import { trpcClient } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { INTERNAL_SERVER_ERROR } from '@/data/error-messages';
import { homeRoute } from '@/data/routes';
import { useCart } from '@/lib/hooks/use-cart';
import { OrderDetails } from '@/lib/zod/checkout';

interface PaymentDialogProps {
  open: boolean;
  close: () => void;
  orderDetails: OrderDetails;
}

export function PaymentDialog({
  open,
  close,
  orderDetails,
}: PaymentDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const cart = useCart();
  const createOrder = trpcClient.order.createOrder.useMutation();
  const captureOrder = trpcClient.order.captureOrder.useMutation();

  const paypalCreateOrder = async () => {
    const cartItems = cart.items.map((item) => {
      if (!item.product) {
        toast.error(INTERNAL_SERVER_ERROR);
        throw new Error("Product not found");
      }

      return {
        productId: item.product.id,
        quantity: item.quantity,
      };
    });

    const res = await createOrder.mutateAsync(
      { cartItems },
      {
        onError() {
          toast.error(INTERNAL_SERVER_ERROR);
        },
      },
    );

    return res.order.id;
  };

  const paypalOnApprove = async (data: OnApproveData) => {
    await captureOrder.mutateAsync(
      {
        orderId: data.orderID,
        orderDetails,
        cartItems: cart.items.map((item) => {
          if (!item.product) {
            toast.error(INTERNAL_SERVER_ERROR);
            throw new Error("Product not found");
          }

          return {
            productId: item.product.id,
            quantity: item.quantity,
          };
        }),
      },
      {
        onSuccess({ message }) {
          cart.removeAll();
          toast.success(message, { duration: 7000 });
          router.push(homeRoute);
        },
        onError(error) {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">
            Make Payment
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <PayPalScriptProvider
          options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
        >
          {loading && (
            <PropagateLoader
              size={20}
              color="#99c620"
              className="mx-auto py-2"
            />
          )}
          <PayPalButtons
            fundingSource={FUNDING.PAYPAL}
            createOrder={paypalCreateOrder}
            onApprove={paypalOnApprove}
            onInit={() => setLoading(false)}
          />
        </PayPalScriptProvider>

        <Separator />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={close}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
