"use client";

import { PaginationState, SortingState } from "@tanstack/react-table";
import { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";

import { trpcClient } from "@/app/_trpc/client";
import { DataTable } from "@/components/ui/other/data-table";
import { UserColumns } from "@/lib/types/admin/user";
import { pageSchema, pageSizeSchema } from "@/lib/zod/table";
import { AppRouter } from "@/server/routers";

import { columns } from "./columns";

interface ListProps {
  initialData: inferRouterOutputs<AppRouter>["admin"]["user"]["get"];
}

export default function List({ initialData }: ListProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: pageSchema._def.defaultValue(),
    pageSize: pageSizeSchema._def.defaultValue(),
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const getItems = trpcClient.admin.user.get.useQuery(
    {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      filters: { globalFilter },
    },
    { placeholderData: initialData },
  );

  const refetch = () => getItems.refetch();

  const formattedData: UserColumns[] | undefined = getItems.data?.data.map(
    (item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phoneNumber: item.userInfo?.phoneNumber ?? "",
      countryName: item.userInfo?.country?.name ?? "",
      city: item.userInfo?.city ?? "",
      postalCode: item.userInfo?.postalCode ?? "",
      address: item.userInfo?.address ?? "",
      createdAt: item.createdAt,
    }),
  );

  return (
    <DataTable
      columns={columns(refetch)}
      data={formattedData ?? []}
      totalRecords={getItems.data?.totalRecords ?? 1}
      isLoading={getItems.isPlaceholderData}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      searchPlaceholder="Filter users..."
    />
  );
}
