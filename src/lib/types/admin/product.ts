import { DbProductSelect } from "@/db/schemas/products";

export type ProductColumns = Pick<
  DbProductSelect,
  | "id"
  | "type"
  | "name"
  | "price"
  | "width"
  | "minWidth"
  | "maxWidth"
  | "height"
  | "minHeight"
  | "maxHeight"
  | "isFeatured"
  | "createdAt"
>;
