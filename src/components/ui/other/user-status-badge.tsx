import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { UserStatusStyle } from "@/lib/zod/user";

const userStatusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        ACTIVE:
          "border-transparent bg-green-600 text-secondary hover:bg-green-700",
        BLOCKED:
          "border-transparent bg-red-600 text-secondary hover:bg-red-700",
      } as UserStatusStyle,
    },
    defaultVariants: {
      variant: "ACTIVE",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof userStatusBadgeVariants> {}

function UserStatusBadge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn("bg", userStatusBadgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { UserStatusBadge, userStatusBadgeVariants };
