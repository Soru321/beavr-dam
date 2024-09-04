import {
  CheckCircleIcon,
  CircleDollarSignIcon,
  CircleEllipsisIcon,
  HourglassIcon,
  PauseCircleIcon,
  TruckIcon,
  UserRoundCheckIcon,
  UserRoundXIcon,
  XCircleIcon,
} from "lucide-react";

import { OrderStatusIcon } from "@/lib/zod/order";
import { UserStatusIcon } from "@/lib/zod/user";

export const userStatusIcon: UserStatusIcon = {
  ACTIVE: <UserRoundCheckIcon className="size-4" />,
  BLOCKED: <UserRoundXIcon className="size-4" />,
};

export const orderStatusIcon: OrderStatusIcon = {
  PENDING: <CircleEllipsisIcon className="size-4" />,
  PROCESSING: <HourglassIcon className="size-4" />,
  ONHOLD: <PauseCircleIcon className="size-4" />,
  SHIPPED: <TruckIcon className="size-4" />,
  COMPLETED: <CheckCircleIcon className="size-4" />,
  CANCELED: <XCircleIcon className="size-4" />,
  REFUNDED: <CircleDollarSignIcon className="size-4" />,
};
