import { migrate } from "drizzle-orm/mysql2/migrator";

import { connection, db } from "./";

async function main() {
  console.log("Migration start");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migration end");

  connection.end();
}

main();
