import { DbOrderSelect } from "@/db/schemas/orders";

export type OrderColumns = Pick<
  DbOrderSelect,
  | "id"
  | "invoiceId"
  | "amount"
  | "name"
  | "email"
  | "phoneNumber"
  | "city"
  | "status"
  | "createdAt"
>;
