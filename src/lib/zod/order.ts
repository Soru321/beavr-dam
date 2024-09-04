import { ReactNode } from "react";
import { z } from "zod";

import { orderDetailsSchema } from "./checkout";

export const orderStatusSchema = z.enum([
  "PENDING",
  "PROCESSING",
  "ONHOLD",
  "SHIPPED",
  "COMPLETED",
  "CANCELED",
  "REFUNDED",
]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

const txnStatusSchema = z.enum(["PENDING", "COMPLETED", "CANCELED"]);
export type TxnStatus = z.infer<typeof txnStatusSchema>;

const txnMethodSchema = z.enum(["PAYPAL"]);
export type TxnMethod = z.infer<typeof txnMethodSchema>;

const currencySchema = z.enum(["USD"]);
export type Currency = z.infer<typeof currencySchema>;

export type OrderStatusStyle = {
  [key in OrderStatus]: string;
};

export type OrderStatusIcon = {
  [key in OrderStatus]: ReactNode;
};

export type OrderEmailValue = { title: string; description: string };

export type OrderEmail = {
  [key in OrderStatus]: OrderEmailValue;
};

const cartItems = z.array(
  z.object({
    productId: z.number(),
    quantity: z.number(),
  }),
);

export type CartItem = z.infer<typeof cartItems>[0];

export const createOrderSchema = z.object({ cartItems });

export const captureOrderSchema = z.object({
  orderId: z.string(),
  orderDetails: orderDetailsSchema,
  cartItems,
});
