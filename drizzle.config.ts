import { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schemas/*",
  out: "./drizzle",
} satisfies Config;
