import {
  boolean,
  int,
  longtext,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const pages = mysqlTable("pages", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  content: longtext("content"),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
