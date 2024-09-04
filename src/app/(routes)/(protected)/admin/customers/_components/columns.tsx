"use client";

import { ColumnDef } from "@tanstack/react-table";

import { UserStatusBadge } from "@/components/ui/other/user-status-badge";
import { userStatusIcon } from "@/data/status-icon";
import { UserColumns } from "@/lib/types/admin/user";
import { getDataTableRowSerialNumber } from "@/lib/utils";

export const columns = (refetch: () => void): ColumnDef<UserColumns>[] => {
  return [
    {
      id: "sno",
      header: () => <h4>S.No.</h4>,
      cell: ({ table, row }) => (
        <p>{getDataTableRowSerialNumber(table, row)}</p>
      ),
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
      accessorKey: "countryName",
      header: () => <h4>Country</h4>,
    },
    {
      accessorKey: "city",
      header: () => <h4>City</h4>,
    },
    {
      accessorKey: "postalCode",
      header: () => <h4>Postal Code</h4>,
    },
    {
      accessorKey: "address",
      header: () => <h4>Address</h4>,
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
  ];
};
