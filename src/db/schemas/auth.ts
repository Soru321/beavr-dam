import { relations } from 'drizzle-orm';
import {
    int, mysqlTable, primaryKey, text, timestamp, unique, varchar
} from 'drizzle-orm/mysql-core';

import { Role } from '@/lib/types/auth';
import { UserStatus } from '@/lib/zod/user';

import { countries } from './countries';
import { orders } from './orders';
import { tmpFiles } from './tmp-files';

import type { AdapterAccount } from "@auth/core/adapters";
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  role: varchar("role", { length: 100 })
    .$type<Role>()
    .default("USER")
    .notNull(),
  status: varchar("status", { length: 100 })
    .$type<UserStatus>()
    .default("ACTIVE")
    .notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    fsp: 3,
  }).defaultNow(),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type DbUsersSelect = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ one, many }) => ({
  userInfo: one(userInfo),
  verificationToken: one(verificationTokens),
  tmpFiles: many(tmpFiles),
  oreders: many(orders),
}));

export const userInfo = mysqlTable("user_info", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  countryId: int("country_id").references(() => countries.id, {
    onDelete: "set null",
  }),
  phoneNumber: varchar("phone_number", { length: 30 }),
  address: text("address"),
  city: varchar("city", { length: 255 }),
  postalCode: varchar("postal_code", { length: 30 }),
});

export type DbUserInfoSelect = typeof userInfo.$inferSelect;

export const userInfoRelations = relations(userInfo, ({ one }) => ({
  user: one(users, {
    fields: [userInfo.userId],
    references: [users.id],
  }),
  country: one(countries, {
    fields: [userInfo.countryId],
    references: [countries.id],
  }),
}));

export const accounts = mysqlTable(
  "accounts",
  {
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2048 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const verificationTokens = mysqlTable(
  "verificationTokens",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (vt) => ({
    unq: unique().on(vt.email, vt.token),
  }),
);

export const verificationTokensRelations = relations(
  verificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [verificationTokens.userId],
      references: [users.id],
    }),
  }),
);
