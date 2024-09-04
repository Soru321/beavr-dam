import {
  BaggageClaimIcon,
  ClipboardCheckIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ShieldCheckIcon,
  UsersRoundIcon,
} from "lucide-react";

import {
  dashboardRoute,
  ordersRoute,
  pageRoute,
  productsRoute,
  usersRoute,
} from "../routes/admin";

export const adminMenu = [
  {
    title: "Dashboard",
    href: dashboardRoute,
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Products",
    href: productsRoute,
    icon: <PackageIcon />,
  },
  {
    title: "Orders",
    href: ordersRoute,
    icon: <BaggageClaimIcon />,
  },
  {
    title: "Customers",
    href: usersRoute,
    icon: <UsersRoundIcon />,
  },
  {
    title: "Privacy Policy",
    href: pageRoute("privacy-policy"),
    icon: <ShieldCheckIcon />,
  },
  {
    title: "Terms and Conditions",
    href: pageRoute("terms-and-conditions"),
    icon: <ClipboardCheckIcon />,
  },
];
