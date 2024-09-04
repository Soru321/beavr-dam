import { relations } from 'drizzle-orm';
import {
    boolean, decimal, int, longtext, mysqlTable, text, timestamp, varchar
} from 'drizzle-orm/mysql-core';

import { ProductType } from '@/lib/zod/product';

import { files } from './files';
import { orderProducts } from './orders';

export const products = mysqlTable("products", {
  id: int("id").primaryKey().autoincrement(),
  type: varchar("type", { length: 50 })
    .$type<ProductType>()
    .default("GATE")
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 7, scale: 2 }).notNull(),
  width: int("width"),
  minWidth: int("min_width"),
  maxWidth: int("max_width"),
  height: int("height"),
  minHeight: int("min_height"),
  maxHeight: int("max_height"),
  sku: varchar("sku", { length: 255 }),
  isFeatured: boolean("is_featured").default(false).notNull(),
  shortDescription: text("short_description"),
  description: longtext("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type DbProductSelect = typeof products.$inferSelect;
export type DbProductInsert = typeof products.$inferInsert;

export const productsRelations = relations(products, ({ many }) => ({
  productFiles: many(productFiles),
  orderProducts: many(orderProducts),
}));

export const productFiles = mysqlTable("product_files", {
  id: int("id").primaryKey().autoincrement(),
  productId: int("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  fileId: int("file_id")
    .notNull()
    .references(() => files.id, { onDelete: "cascade" }),
});

export type DbProductFilesInsert = typeof productFiles.$inferInsert;
export type DbProductFilesSelect = typeof productFiles.$inferSelect;

export const productFilesRelations = relations(productFiles, ({ one }) => ({
  product: one(products, {
    fields: [productFiles.productId],
    references: [products.id],
  }),
  file: one(files, {
    fields: [productFiles.fileId],
    references: [files.id],
  }),
}));
