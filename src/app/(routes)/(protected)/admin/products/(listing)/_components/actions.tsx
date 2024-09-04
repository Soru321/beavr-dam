import { Row } from '@tanstack/react-table';
import { EditIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { editProduct } from '@/data/routes/admin';
import { useAlertDialog } from '@/lib/hooks/use-alert-dialog';
import { ProductColumns } from '@/lib/types/admin/product';

interface ActionsProps {
  row: Row<ProductColumns>;
}

export function Actions({ row }: ActionsProps) {
  const alertDialog = useAlertDialog();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-2">
          <Link href={editProduct(row.original.id)}>
            <DropdownMenuItem className="space-x-2">
              <EditIcon className="size-5" />
              <span>Edit</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => alertDialog.open(row.original.id)}
            className="space-x-2 bg-red-500 !text-white focus:bg-red-600"
          >
            <Trash2Icon className="size-5" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
