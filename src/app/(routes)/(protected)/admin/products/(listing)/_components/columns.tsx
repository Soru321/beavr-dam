"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductColumns } from "@/lib/types/admin/product";
import { getDataTableRowSerialNumber } from "@/lib/utils";

import { Actions } from "./actions";
import IsFeatured from "./is-featured";

export const columns = (refetch: () => void): ColumnDef<ProductColumns>[] => {
  return [
    {
      id: "sno",
      header: () => <h4>S.No.</h4>,
      cell: ({ table, row }) => (
        <p>{getDataTableRowSerialNumber(table, row)}</p>
      ),
    },
    {
      accessorKey: "type",
      header: () => <h4>Type</h4>,
    },
    {
      accessorKey: "name",
      header: () => <h4>Product Name</h4>,
    },
    {
      accessorKey: "price",
      header: () => <h4>Price</h4>,
    },
    {
      accessorKey: "width",
      header: () => <h4>Width</h4>,
    },
    {
      accessorKey: "minWidth",
      header: () => <h4>Min. Width</h4>,
    },
    {
      accessorKey: "maxWidth",
      header: () => <h4>Max. Width</h4>,
    },
    {
      accessorKey: "height",
      header: () => <h4>Height</h4>,
    },
    {
      accessorKey: "minHeight",
      header: () => <h4>Min. Height</h4>,
    },
    {
      accessorKey: "maxHeight",
      header: () => <h4>Max. Height</h4>,
    },
    {
      accessorKey: "isFeatured",
      header: () => <h4>Is Featured</h4>,
      cell: ({ row }) => <IsFeatured row={row} refetch={refetch} />,
    },
    {
      accessorKey: "createdAt",
      header: () => <h4>Created At</h4>,
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        const dateString = date.toLocaleDateString("en-US");
        const timeString = date.toLocaleTimeString("en-US");
        return (
          <p>
            <span className="whitespace-nowrap">{dateString}</span>
            <br />
            <span className="whitespace-nowrap">{timeString}</span>
          </p>
        );
      },
    },
    {
      id: "actions",
      header: () => <h4>Actions</h4>,
      enableHiding: false,
      cell: ({ row }) => <Actions row={row} />,
    },
  ];
};
