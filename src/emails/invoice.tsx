import { render } from "@react-email/render";

import { DbOrderSelect } from "@/db/schemas/orders";
import { sendEmail } from "@/lib/server/utils";
import { OrderEmailValue } from "@/lib/zod/order";

import Invoice from "./templates/invoice";

export interface SendInvoiceProps {
  orderEmailValue?: OrderEmailValue;
  paymentMethod: string;
  invoiceId: string;
  date: string;
  amount?: string;
  items?: {
    name: string;
    shortDescription: string | null;
    image?: string;
    quantity?: number;
    amount: string;
  }[];
  customer: Pick<
    DbOrderSelect,
    | "name"
    | "email"
    | "phoneNumber"
    | "country"
    | "address"
    | "city"
    | "postalCode"
  >;
}

export async function sendInvoice(props: SendInvoiceProps) {
  const html = render(<Invoice {...props} />);
  await sendEmail({
    from: process.env.SALES_EMAIL,
    to: props.customer.email ?? "",
    subject: props.orderEmailValue?.title ?? "Invoice",
    html,
  });
}
