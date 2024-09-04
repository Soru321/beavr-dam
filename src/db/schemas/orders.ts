import { relations } from "drizzle-orm";
import {
  decimal,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { Currency, OrderStatus, TxnMethod, TxnStatus } from "@/lib/zod/order";
import { ProductType } from "@/lib/zod/product";

import { users } from "./auth";
import { files } from "./files";
import { products } from "./products";

export const orders = mysqlTable("orders", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  invoiceId: varchar("invoice_id", { length: 255 }),
  amount: decimal("amount", { precision: 7, scale: 2 }).notNull(),
  status: varchar("status", { length: 100 })
    .$type<OrderStatus>()
    .default("PENDING")
    .notNull(),
  txnOrderId: varchar("txn_order_id", { length: 255 }).notNull(),
  txnStatus: varchar("txn_status", { length: 100 })
    .$type<TxnStatus>()
    .default("PENDING")
    .notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 30 }).notNull(),
  city: varchar("city", { length: 255 }),
  postalCode: varchar("postal_code", { length: 60 }).notNull(),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type DbOrderSelect = typeof orders.$inferSelect;

export const ordersRelations = relations(orders, ({ one, many }) => ({
  transaction: one(transactions),
  orderProducts: many(orderProducts),
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const orderProducts = mysqlTable("order_products", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: int("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  fileId: int("file_id").references(() => files.id, { onDelete: "set null" }),
  quantity: int("quantity").notNull(),
  amount: decimal("amount", { precision: 7, scale: 2 }).notNull(),
  type: varchar("type", { length: 50 }).$type<ProductType>().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 7, scale: 2 }).notNull(),
  width: int("width"),
  minWidth: int("min_width"),
  maxWidth: int("max_width"),
  height: int("height"),
  minHeight: int("min_height"),
  maxHeight: int("max_height"),
  sku: varchar("sku", { length: 255 }),
  shortDescription: text("short_description"),
});

export type DbOrderProductsInsert = typeof orderProducts.$inferInsert;

export const orderProductsRelations = relations(orderProducts, ({ one }) => ({
  order: one(orders, {
    fields: [orderProducts.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderProducts.productId],
    references: [products.id],
  }),
  file: one(files, {
    fields: [orderProducts.fileId],
    references: [files.id],
  }),
}));

export const transactions = mysqlTable("transactions", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  txnId: varchar("txn_id", { length: 255 }),
  amount: decimal("amount", { precision: 7, scale: 2 }),
  method: varchar("method", { length: 100 }).$type<TxnMethod>(),
  currency: varchar("currency", { length: 100 })
    .$type<Currency>()
    .default("USD")
    .notNull(),
  status: varchar("status", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  order: one(orders, {
    fields: [transactions.orderId],
    references: [orders.id],
  }),
}));
