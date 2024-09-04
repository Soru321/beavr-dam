import { hash } from "bcrypt";

import { db } from "../";
import { users } from "../schemas/auth";

export const run = async () => {
  const password = await hash("admin123#", 10);

  await db.insert(users).values({
    role: "ADMIN",
    name: "Admin",
    email: "admin@admin.com",
    password,
  });
};
