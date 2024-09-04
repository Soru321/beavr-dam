import { relations } from 'drizzle-orm';
import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

import { userInfo } from './auth';

export const countries = mysqlTable("countries", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 255 }).notNull(),
  timezone: varchar("timezone", { length: 255 }).notNull(),
  utc: varchar("utc", { length: 255 }).notNull(),
  mobileCode: varchar("mobileCode", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const countriesRelations = relations(countries, ({ many }) => ({
  usersInfo: many(userInfo),
}));

export type DbCountryInsert = typeof countries.$inferInsert;
export type DbCountrySelect = typeof countries.$inferSelect;
