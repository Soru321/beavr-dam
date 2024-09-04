import "dotenv/config";

import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2";

import * as authSchema from "./schemas/auth";
import * as countriesSchema from "./schemas/countries";
import * as filesSchema from "./schemas/files";
import * as ordersSchema from "./schemas/orders";
import * as pagesSchema from "./schemas/pages";
import * as productsSchema from "./schemas/products";
import * as tmpFilesSchema from "./schemas/tmp-files";

export const connection = createConnection({
  uri: process.env.DATABASE_URL,
});

export const db = drizzle(connection, {
  mode: "default",
  schema: {
    ...countriesSchema,
    ...tmpFilesSchema,
    ...filesSchema,
    ...authSchema,
    ...productsSchema,
    ...ordersSchema,
    ...pagesSchema,
  },
});

export type Db = typeof db;
