import { ReactNode } from "react";
import { z } from "zod";

export const userStatusSchema = z.enum(["ACTIVE", "BLOCKED"]);
export type UserStatus = z.infer<typeof userStatusSchema>;

export type UserStatusStyle = {
  [key in UserStatus]: string;
};

export type UserStatusIcon = {
  [key in UserStatus]: ReactNode;
};
