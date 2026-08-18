"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Loader2,
  LogOut,
  Receipt,
  Settings as SettingsIcon,
  Ticket,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { ProfileForm } from "@/components/account/profile-form";
import { logout } from "@/app/actions/auth";
import { getAccountData } from "@/app/actions/account";
import type { Entry, Transaction, Competition } from "@/lib/types";

type AccountData = {
  entries: { entry: Entry; competition: Competition | null }[];
  transactions: { transaction: Transaction; competition: Competition | null }[];
};

const STATUS_VARIANT = {
  paid: "default",
  pending: "secondary",
  failed: "destructive",
  refunded: "secondary",
} as const;

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function AccountSheet({
  open,
  onOpenChange,
  profile,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: { fullName: string; email: string; phone: string; isAdmin: boolean };
}) {
  const router = useRouter();
  const [data, setData] = useState<AccountData | null>(null);
  const [, startTransition] = useTransition();
  const loading = open && data === null;

  useEffect(() => {
    if (!open || data) return;
    getAccountData().then(setData);
  }, [open, data]);

  const active = data?.entries.filter((e) => e.competition?.status === "live") ?? [];
  const ticketsHeld =
    data?.entries.reduce((sum, e) => sum + e.entry.ticketNumbers.length, 0) ?? 0;

  function refreshAfterProfileUpdate() {
    startTransition(() => router.refresh());
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="dark w-full bg-background text-foreground sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="sr-only">Your account</SheetTitle>
          <SheetDescription className="sr-only">
            Your entries, orders, and profile settings.
          </SheetDescription>
          <div className="flex items-center gap-3 pt-2">
            <Avatar size="lg">
              <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                {initials(profile.fullName || profile.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-semibold">
                  {profile.fullName || profile.email}
                </p>
                {profile.isAdmin && (
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    Admin
                  </Badge>
                )}
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </div>
        </SheetHeader>

        {profile.isAdmin && (
          <div className="px-4">
            <Button
              variant="outline"
              className="w-full"
              nativeButton={false}
              render={<Link href="/admin" onClick={() => onOpenChange(false)} />}
            >
              <LayoutDashboard className="size-4" />
              Go to admin panel
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 px-4">
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">Active entries</p>
            <p className="text-xl font-semibold">
              {loading ? "—" : active.length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">Tickets held</p>
            <p className="text-xl font-semibold">
              {loading ? "—" : ticketsHeld}
            </p>
          </div>
        </div>

        <Tabs defaultValue="entries" className="flex-1 overflow-hidden px-4">
          <TabsList className="w-full">
            <TabsTrigger value="entries">
              <Ticket className="size-3.5" />
              Entries
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Receipt className="size-3.5" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="size-3.5" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entries" className="mt-3 space-y-2 overflow-y-auto">
            {loading ? (
              <Loading />
            ) : !data || data.entries.length === 0 ? (
              <Empty icon={Ticket} label="No entries yet." />
            ) : (
              data.entries.map(({ entry, competition }) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">
                      {competition?.title ?? "Unknown competition"}
                    </p>
                    <Badge
                      variant={
                        competition?.status === "live" ? "default" : "secondary"
                      }
                      className="shrink-0"
                    >
                      {competition?.status === "live" ? "Live" : "Closed"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tickets: {entry.ticketNumbers.join(", ")}
                  </p>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="orders" className="mt-3 space-y-2 overflow-y-auto">
            {loading ? (
              <Loading />
            ) : !data || data.transactions.length === 0 ? (
              <Empty icon={Receipt} label="No orders yet." />
            ) : (
              data.transactions.map(({ transaction, competition }) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {competition?.title ?? "Unknown competition"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString(
                        "en-GB",
                      )}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold">
                      {formatGBP(transaction.amount)}
                    </p>
                    <Badge
                      variant={STATUS_VARIANT[transaction.status]}
                      className="mt-0.5"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-3 overflow-y-auto">
            <ProfileForm
              fullName={profile.fullName}
              email={profile.email}
              phone={profile.phone}
              onSaved={refreshAfterProfileUpdate}
              bare
            />
          </TabsContent>
        </Tabs>

        <div className="mt-auto border-t border-border p-4">
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      Loading…
    </div>
  );
}

function Empty({
  icon: Icon,
  label,
}: {
  icon: typeof Ticket;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-10 text-center">
      <Icon className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
