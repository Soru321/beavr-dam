import { relations } from "drizzle-orm";
import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { orderProducts } from "./orders";
import { productFiles } from "./products";

export const files = mysqlTable("files", {
  id: int("id").primaryKey().autoincrement(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  path: text("path").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DbFilesInsert = typeof files.$inferInsert;
export type DbFilesSelect = typeof files.$inferSelect;

export const filesRelations = relations(files, ({ one, many }) => ({
  productFile: one(productFiles),
  orderProducts: many(orderProducts),
}));
