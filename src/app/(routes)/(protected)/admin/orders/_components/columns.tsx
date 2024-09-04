"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/ui/other/order-status-badge";
import { orderStatusIcon } from "@/data/status-icon";
import { OrderColumns } from "@/lib/types/admin/order";
import { formatAmount, getDataTableRowSerialNumber } from "@/lib/utils";

import { Actions } from "./actions";

export const columns = (refetch: () => void): ColumnDef<OrderColumns>[] => {
  return [
    {
      id: "sno",
      header: () => <h4>S.No.</h4>,
      cell: ({ table, row }) => (
        <p>{getDataTableRowSerialNumber(table, row)}</p>
      ),
    },
    {
      accessorKey: "invoiceId",
      header: () => <h4>Invoice ID</h4>,
    },
    {
      accessorKey: "amount",
      header: () => <h4>Amount</h4>,
      cell: ({ row }) => <div>{formatAmount(row.original.amount)}</div>,
    },
    {
      accessorKey: "name",
      header: () => <h4>Name</h4>,
    },
    {
      accessorKey: "email",
      header: () => <h4>Email</h4>,
    },
    {
      accessorKey: "phoneNumber",
      header: () => <h4>Phone Number</h4>,
    },
    {
      accessorKey: "city",
      header: () => <h4>City</h4>,
    },
    {
      accessorKey: "status",
      header: () => <h4>Status</h4>,
      cell: ({ row }) => (
        <OrderStatusBadge variant={row.original.status} className="space-x-1">
          {orderStatusIcon[row.original.status]}
          <span>{row.original.status}</span>
        </OrderStatusBadge>
      ),
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
      cell: ({ row }) => <Actions row={row} refetch={refetch} />,
    },
  ];
};
