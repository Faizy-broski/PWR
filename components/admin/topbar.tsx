"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown, LogOut, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminQuickSearch } from "@/components/admin/quick-search";
import { adminNavLinks } from "@/components/admin/nav-links";
import { logout } from "@/app/actions/auth";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function usePageTitle() {
  const pathname = usePathname();
  const match = [...adminNavLinks]
    .sort((a, b) => b.href.length - a.href.length)
    .find((link) =>
      link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href),
    );
  return match?.label ?? "Admin";
}

export function AdminTopbar({
  name,
  competitions,
}: {
  name: string;
  competitions: { id: string; title: string }[];
}) {
  const title = usePageTitle();

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border bg-background px-4 py-3 sm:px-6 lg:px-8">
      <h1 className="text-lg font-bold tracking-tight">{title}</h1>

      <div className="flex flex-1 items-center justify-end gap-3">
        <AdminQuickSearch competitions={competitions} />

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Notifications"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-3 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Messages"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <MessageSquare className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-3 text-center text-sm text-muted-foreground">
              No messages yet.
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex shrink-0 items-center gap-2 rounded-full py-1 pr-1.5 pl-1 transition-colors hover:bg-muted">
            <Avatar size="sm">
              <AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 text-left sm:block">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-muted-foreground">
                Administrator
              </p>
            </div>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-muted-foreground">
                Administrator
              </p>
            </div>
            <DropdownMenuItem variant="destructive" onClick={() => logout()}>
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
