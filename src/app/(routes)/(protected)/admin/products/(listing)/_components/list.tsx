"use client";

import { PaginationState, SortingState } from "@tanstack/react-table";
import { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import toast from "react-hot-toast";

import { trpcClient } from "@/app/_trpc/client";
import { AlertDialog } from "@/components/ui/other/alert-dialog";
import { DataTable } from "@/components/ui/other/data-table";
import { pageSchema, pageSizeSchema } from "@/lib/zod/table";
import { AppRouter } from "@/server/routers";

import { columns } from "./columns";

interface ListProps {
  initialData: inferRouterOutputs<AppRouter>["admin"]["product"]["get"];
}

export default function List({ initialData }: ListProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: pageSchema._def.defaultValue(),
    pageSize: pageSizeSchema._def.defaultValue(),
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const getItems = trpcClient.admin.product.get.useQuery(
    {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      filters: { globalFilter },
    },
    { placeholderData: initialData },
  );
  const deleteItem = trpcClient.admin.product.deleteById.useMutation();
  const refetch = () => getItems.refetch();

  const onDeleteItem = (itemId: number) => {
    deleteItem.mutate(
      { id: itemId },
      {
        onSuccess: ({ message }) => {
          getItems.refetch();
          toast.success(message);
        },
        onError: ({ message }) => toast.error(message),
      },
    );
  };

  return (
    <>
      <DataTable
        columns={columns(refetch)}
        data={getItems.data?.data ?? []}
        totalRecords={getItems.data?.totalRecords ?? 1}
        isLoading={getItems.isPlaceholderData}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        searchPlaceholder="Filter products..."
      />

      <AlertDialog onAccept={onDeleteItem} />
    </>
  );
}
