import { XIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import { INTERNAL_SERVER_ERROR } from "@/data/error-messages";
import { productEstimatorToolRoute } from "@/data/routes";
import { useAddToCartDialog } from "@/lib/hooks/use-add-to-cart-dialog";
import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "../button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../dialog";

interface AddToCartDialogProps {
  onAdd: (itemId: number) => void;
}

export function AddToCartDialog({ onAdd }: AddToCartDialogProps) {
  const addToCartDialog = useAddToCartDialog();

  // Handle add to cart
  const onAddToCart = () => {
    if (!addToCartDialog.itemId) {
      return toast.error(INTERNAL_SERVER_ERROR);
    }

    onAdd(addToCartDialog.itemId);
    addToCartDialog.close();
  };

  return (
    <Dialog open={addToCartDialog.isOpen}>
      <DialogContent className="">
        <DialogHeader>
          {/* Close button */}
          <XIcon
            onClick={addToCartDialog.close}
            strokeWidth={3}
            className="absolute right-2 top-2 size-5 cursor-pointer opacity-40 transition hover:scale-125 hover:text-red-500 hover:opacity-100"
          />
        </DialogHeader>

        <p className="text-lg">
          Not sure what to order?{" "}
          <Link
            href={productEstimatorToolRoute}
            className="text-primary hover:underline"
          >
            Click here
          </Link>{" "}
          to get an accurate estimate of what your house needs using our{" "}
          <span className="font-semibold">Product Estimator Tool</span>.
        </p>
        <p className="text-sm">
          <span className="font-semibold">Warning:</span> To insure your house
          is accurately measured please use this tool to determine what is
          needed for optimal protection. Ordering manually may cause calculation
          errors and products to be improperly ordered.
        </p>

        <DialogFooter className="gap-2">
          <Button onClick={onAddToCart}>Proceed To Cart</Button>

          <Link
            href={productEstimatorToolRoute}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Product Estimator Tool
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
