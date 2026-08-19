import { LayoutDashboard, Trophy, Receipt, Users } from "lucide-react";

// Shared between the sidebar (nav + active state) and the topbar (page
// title derived from the current route) so the two never drift apart.
export const adminNavLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/competitions", label: "Competitions", icon: Trophy },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
  { href: "/admin/users", label: "Customers", icon: Users },
] as const;
