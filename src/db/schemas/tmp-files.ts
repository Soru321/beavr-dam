import { relations } from "drizzle-orm";
import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { users } from "./auth";

export const tmpFiles = mysqlTable("tmp_files", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").references(() => users.id, { onDelete: "cascade" }),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  path: text("path").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DbTmpFilesSelect = typeof tmpFiles.$inferSelect;

export const tmpFilesRelations = relations(tmpFiles, ({ one }) => ({
  user: one(users, {
    fields: [tmpFiles.userId],
    references: [users.id],
  }),
}));
