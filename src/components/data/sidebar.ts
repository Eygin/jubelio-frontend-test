import { Boxes, LucideIcon, Package } from "lucide-react";

export type SidebarType = {
  label: string;
  href: string;
  Icon: LucideIcon;
};

export const sidebar: Array<SidebarType> = [
  {
    label: "Products",
    href: "/products",
    Icon: Package,
  },
  {
    label: "Adjustment",
    href: "/adjustment",
    Icon: Boxes,
  },
];
