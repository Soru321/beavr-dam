import { Row } from '@tanstack/react-table';
import { MoreVerticalIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { trpcClient } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup,
    DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { INTERNAL_SERVER_ERROR } from '@/data/error-messages';
import { OrderColumns } from '@/lib/types/admin/order';
import { OrderStatus, orderStatusSchema } from '@/lib/zod/order';

interface ActionsProps {
  row: Row<OrderColumns>;
  refetch: () => void;
}

export function Actions({ row, refetch }: ActionsProps) {
  const statuses = orderStatusSchema._def.values;
  const changeStatus = trpcClient.admin.order.changeStatus.useMutation();

  const onValueChange = (value: string) => {
    if (value === row.original.status) return;

    changeStatus.mutate(
      {
        orderId: row.original.id,
        status: value as OrderStatus,
      },
      {
        onSuccess({ message }) {
          refetch();
          toast.success(message);
        },
        onError() {
          toast.error(INTERNAL_SERVER_ERROR);
        },
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Order Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={row.original.status}
          onValueChange={onValueChange}
        >
          {statuses.map((status) => (
            <DropdownMenuRadioItem
              key={`order-status-${status}`}
              value={status}
            >
              {status}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
