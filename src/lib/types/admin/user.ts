import { DbUserInfoSelect, DbUsersSelect } from "@/db/schemas/auth";

export type UserColumns = Pick<
  DbUsersSelect,
  "id" | "name" | "email" | "createdAt"
> &
  Pick<DbUserInfoSelect, "phoneNumber" | "city" | "postalCode" | "address"> & {
    countryName: string;
  };
