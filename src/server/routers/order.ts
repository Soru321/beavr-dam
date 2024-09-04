import paypal from '@paypal/checkout-server-sdk';
import { OrderResponseBody } from '@paypal/paypal-js/types/apis/orders';
import { TRPCError } from '@trpc/server';
import { desc, eq, inArray } from 'drizzle-orm';

import { INTERNAL_SERVER_ERROR } from '@/data/error-messages';
import { orderEmail } from '@/data/order-email';
import { Db, db } from '@/db';
import { userInfo, users } from '@/db/schemas/auth';
import { countries } from '@/db/schemas/countries';
import { DbOrderProductsInsert, orderProducts, orders, transactions } from '@/db/schemas/orders';
import { DbProductSelect, products } from '@/db/schemas/products';
import { sendInvoice } from '@/emails/invoice';
import { OrderDetails } from '@/lib/zod/checkout';
import {
    captureOrderSchema, CartItem, createOrderSchema, Currency, OrderStatus
} from '@/lib/zod/order';

import { paypalClient } from '../paypal';
import { publicProcedure, router } from '../trpc';

export const orderRouter = router({
  createOrder: publicProcedure
    .input(createOrderSchema)
    .mutation(async ({ input: { cartItems } }) => {
      const formattedProducts = await getFormattedProducts({ cartItems });
      const amount = calculateAmount({ formattedProducts });

      const client = paypalClient();
      const request = new paypal.orders.OrdersCreateRequest();
      request.headers["Prefer"] = "return=representation";
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD" as Currency,
              value: String(amount),
              breakdown: {
                item_total: {
                  currency_code: "USD" as Currency,
                  value: String(amount),
                },
                shipping: { currency_code: "USD" as Currency, value: "0" },
                handling: { currency_code: "USD" as Currency, value: "0" },
                discount: { currency_code: "USD" as Currency, value: "0" },
                shipping_discount: {
                  currency_code: "USD" as Currency,
                  value: "0",
                },
                tax_total: { currency_code: "USD" as Currency, value: "0" },
                insurance: { currency_code: "USD" as Currency, value: "0" },
              },
            },
            items: formattedProducts.map((product) => ({
              name: fixLength(product.name, 127),
              description: fixLength(product.shortDescription ?? "", 127),
              quantity: String(product.quantity),
              sku: product.sku ?? undefined,
              category: "PHYSICAL_GOODS",
              unit_amount: {
                currency_code: "USD" as Currency,
                value: product.price,
              },
            })),
          },
        ],
      });

      const response = await client.execute(request);

      return { order: response.result };
    }),

  captureOrder: publicProcedure
    .input(captureOrderSchema)
    .mutation(async ({ input }) => {
      const client = paypalClient();
      const request = new paypal.orders.OrdersCaptureRequest(input.orderId);
      const paypalRes = await client.execute(request);
      const paypalResult = paypalRes.result as OrderResponseBody;
      if (paypalResult.status !== "COMPLETED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Payment failed.",
        });
      }

      const txnOrderId = paypalResult.id as string;
      const txnId = paypalResult.purchase_units
        ?.at(0)
        ?.payments?.captures?.at(0)?.id;
      const txnDate = paypalResult.purchase_units
        ?.at(0)
        ?.payments?.captures?.at(0)?.create_time;
      const txnAmount = paypalResult.purchase_units
        ?.at(0)
        ?.payments?.captures?.at(0)?.amount?.value as string;
      const txnItems = paypalResult.purchase_units?.at(0)?.items;
      const txnCurrency =
        paypalResult.purchase_units?.at(0)?.amount?.currency_code;
      const txnStatus = paypalResult.status;

      await db.transaction(async (tx) => {
        const formattedProducts = await getFormattedProducts({
          cartItems: input.cartItems,
        });

        const country = await tx.query.countries.findFirst({
          where: eq(countries.id, input.orderDetails.countryId),
        });

        const lastOrder = await tx.query.orders.findFirst({
          orderBy: desc(orders.id),
        });

        const invoiceId = incrementInvoiceId(
          lastOrder?.invoiceId ?? "INV00000000",
        );

        const { userId } = await createOrUpdateUser({
          orderDetails: input.orderDetails,
        });

        const order = await tx.insert(orders).values({
          userId,
          invoiceId,
          amount: txnAmount,
          txnOrderId: txnOrderId,
          txnStatus,
          name: input.orderDetails.name,
          email: input.orderDetails.email,
          country: country?.name ?? "",
          phoneNumber: input.orderDetails.phoneNumber,
          city: input.orderDetails.city,
          postalCode: input.orderDetails.postalCode,
          address: input.orderDetails.address,
        });
        const orderId = order[0].insertId;

        const orderProductsValues: DbOrderProductsInsert[] =
          formattedProducts.map((item, index) => ({
            orderId,
            productId: item.id,
            fileId: item.productFiles[0].fileId,
            quantity: item.quantity,
            amount: !!txnItems
              ? (txnItems.at(index)?.unit_amount.value as string)
              : String(item.amount),
            type: item.type,
            name: item.name,
            price: item.price,
            width: item.width,
            minWidth: item.minWidth,
            maxWidth: item.maxWidth,
            height: item.height,
            minHeight: item.minHeight,
            maxHeight: item.maxHeight,
            sku: item.sku,
            shortDescription: item.shortDescription,
          }));

        await tx.insert(orderProducts).values(orderProductsValues);

        await tx.insert(transactions).values({
          orderId,
          txnId,
          amount: txnAmount,
          method: "PAYPAL",
          currency: txnCurrency as Currency,
          status: txnStatus ?? "COMPLETED",
        });

        sendInvoiceFunc({ db: tx, orderId, orderStatus: "PENDING" });
      });

      return {
        message: "Payment completed successfully",
        result: paypalResult,
      };
    }),
});

function fixLength(string: string, maxLength: number) {
  return string.length > maxLength - 3
    ? string.substring(0, maxLength - 3) + "..."
    : string;
}

interface GetFormattedProductsProps {
  cartItems: CartItem[];
}

async function getFormattedProducts({ cartItems }: GetFormattedProductsProps) {
  const formattedCartItems = Object.values(
    cartItems.reduce((acc: Record<number, CartItem>, item) => {
      if (!!acc[item.productId]) {
        acc[item.productId].quantity += item.quantity;
      } else {
        acc[item.productId] = {
          productId: item.productId,
          quantity: item.quantity,
        };
      }

      return acc;
    }, {}),
  );

  const productIds = formattedCartItems.map((item) => item.productId);
  const dbProducts = await db.query.products.findMany({
    where: inArray(products.id, productIds),
    with: { productFiles: { with: { file: true } } },
  });
  if (!dbProducts.length) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: INTERNAL_SERVER_ERROR,
    });
  }

  return dbProducts.map((product) => {
    const item = formattedCartItems.find(
      (item) => item.productId === product.id,
    );
    const quantity = item?.quantity ?? 1;
    const amount = +product.price * quantity;
    return {
      ...product,
      quantity,
      amount,
    };
  });
}

interface CalculateAmountProps {
  formattedProducts: (DbProductSelect & { quantity: number })[];
}

function calculateAmount({ formattedProducts }: CalculateAmountProps) {
  return formattedProducts.reduce(
    (total, product) => total + +product.price * product.quantity,
    0,
  );
}

function incrementInvoiceId(invoiceId: string) {
  const match = invoiceId.match(/\d+$/);
  const numericPart = match ? parseInt(match[0], 10) : 0;
  const numericLength = match ? match[0].length : 0;
  const newNumericPart = numericPart + 1;
  const newInvoiceId = invoiceId.replace(
    /\d+$/,
    String(newNumericPart).padStart(numericLength, "0"),
  );

  return newInvoiceId;
}

interface SendInvoiceFuncProps {
  db: Db;
  orderId: number;
  orderStatus: OrderStatus;
}

export async function sendInvoiceFunc({
  db,
  orderId,
  orderStatus,
}: SendInvoiceFuncProps) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      orderProducts: {
        with: { product: true, file: true },
      },
    },
  });

  if (!order) return;

  sendInvoice({
    orderEmailValue: orderEmail[orderStatus],
    paymentMethod: "PAYPAL",
    invoiceId: !!order?.invoiceId ? order.invoiceId : "",
    date: new Date(order?.createdAt ?? new Date()).toLocaleString("en-US"),
    amount: order?.amount,
    items: order?.orderProducts.map((item) => ({
      name: item.name,
      shortDescription: item.shortDescription,
      image: item.file?.path,
      quantity: item.quantity,
      amount: item.amount,
    })),
    customer: {
      name: order?.name,
      email: order?.email,
      phoneNumber: order?.phoneNumber,
      country: order?.country,
      address: order?.address,
      city: order?.city,
      postalCode: order?.postalCode,
    },
  });
}

interface CreateOrUpdateUserProps {
  orderDetails: OrderDetails;
}

async function createOrUpdateUser({
  orderDetails,
}: CreateOrUpdateUserProps): Promise<{ userId: number }> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, orderDetails.email),
  });
  if (!!user) {
    db.update(users)
      .set({ name: orderDetails.name })
      .where(eq(users.id, user.id));
    db.update(userInfo)
      .set({
        countryId: orderDetails.countryId,
        phoneNumber: orderDetails.phoneNumber,
        address: orderDetails.address,
        city: orderDetails.city,
        postalCode: orderDetails.postalCode,
      })
      .where(eq(users.id, user.id));

    return { userId: user.id };
  }

  const userId: number = await db.transaction(async (tx) => {
    const user = await tx.insert(users).values({
      name: orderDetails.name,
      email: orderDetails.email,
      emailVerified: null,
    });
    const userId = user[0].insertId;

    await tx.insert(userInfo).values({
      userId,
      countryId: orderDetails.countryId,
      phoneNumber: orderDetails.phoneNumber,
      address: orderDetails.address,
      city: orderDetails.city,
      postalCode: orderDetails.postalCode,
    });

    return userId;
  });

  return { userId };
}
