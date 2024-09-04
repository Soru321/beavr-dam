import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { OrderStatusStyle } from "@/lib/zod/order";

const orderStatusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        PENDING:
          "border-transparent bg-gray-600 text-secondary hover:bg-gray-700",
        PROCESSING:
          "border-transparent bg-orange-400 text-secondary hover:bg-gray-500",
        ONHOLD:
          "border-transparent bg-cyan-600 text-secondary hover:bg-cyan-700",
        SHIPPED:
          "border-transparent bg-blue-600 text-secondary hover:bg-blue-700",
        COMPLETED:
          "border-transparent bg-green-600 text-secondary hover:bg-green-700",
        CANCELED:
          "border-transparent bg-red-600 text-secondary hover:bg-red-700",
        REFUNDED:
          "border-transparent bg-purple-400 text-secondary hover:bg-purple-500",
      } as OrderStatusStyle,
    },
    defaultVariants: {
      variant: "PENDING",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof orderStatusBadgeVariants> {}

function OrderStatusBadge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn("bg", orderStatusBadgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { OrderStatusBadge, orderStatusBadgeVariants };
