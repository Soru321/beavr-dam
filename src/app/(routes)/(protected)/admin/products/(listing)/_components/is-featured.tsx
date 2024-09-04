import { Row } from "@tanstack/react-table";
import toast from "react-hot-toast";

import { trpcClient } from "@/app/_trpc/client";
import { Switch } from "@/components/ui/switch";
import { ProductColumns } from "@/lib/types/admin/product";

interface IsFeaturedProps {
  row: Row<ProductColumns>;
  refetch: () => void;
}

export default function IsFeatured({ row, refetch }: IsFeaturedProps) {
  const changeIsFeatured =
    trpcClient.admin.product.changeIsFeatured.useMutation();

  const onCheckedChange = (value: boolean) => {
    changeIsFeatured.mutate(
      { productId: row.original.id, isFeatured: value },
      {
        onSuccess({ message }) {
          refetch();
          toast.success(message);
        },
        onError({ message }) {
          toast.error(message);
        },
      },
    );
  };

  return (
    <Switch
      checked={row.original.isFeatured}
      onCheckedChange={onCheckedChange}
    />
  );
}
