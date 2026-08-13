"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Trophy, Receipt, Users, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/competitions", label: "Competitions", icon: Trophy },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
  { href: "/admin/users", label: "Users", icon: Users },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function AdminSidebar({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-6 lg:h-fit lg:w-64 lg:shrink-0">
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="hidden items-center gap-3 border-b border-border p-4 lg:flex">
          <Avatar size="lg">
            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold">{name}</p>
              <Badge variant="outline" className="shrink-0 text-[10px]">
                Admin
              </Badge>
            </div>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:p-2.5">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {active && (
                  <span className="absolute inset-y-1 left-0 hidden w-0.5 rounded-full bg-primary lg:block" />
                )}
                <link.icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
          <form action={logout} className="lg:mt-1">
            <button
              type="submit"
              className="flex w-full shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </form>
        </nav>
      </div>
    </aside>
  );
}
