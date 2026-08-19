"use client";

import { useMemo, useState } from "react";
import { Receipt } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchInput } from "@/components/admin/search-input";
import { AdminFilterPills } from "@/components/admin/filter-pills";
import { StatusPill } from "@/components/admin/status-pill";
import { ENTRY_STATUS_STYLE } from "@/lib/admin/entry-status";
import type { getAllTransactions } from "@/lib/data/entries";
import type { TransactionStatus } from "@/lib/types";

type Order = Awaited<ReturnType<typeof getAllTransactions>>[number];

type FilterValue = "all" | TransactionStatus;

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Completed", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter(({ transaction, competition, customerEmail, customerName }) => {
      const matchesSearch = query
        ? [customerName, customerEmail, competition?.title]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(query))
        : true;
      const matchesFilter = filter === "all" ? true : transaction.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border py-16 text-center">
        <Receipt className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminFilterPills options={FILTERS} value={filter} onChange={setFilter} />
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search orders"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border py-16 text-center">
          <Receipt className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No orders match your search.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(
                ({ transaction, competition, customerEmail, customerName }) => {
                  const status = ENTRY_STATUS_STYLE[transaction.status];
                  return (
                    <TableRow
                      key={transaction.id}
                      className="transition-colors hover:bg-brand-gold-light/5"
                    >
                      <TableCell className="font-medium">
                        {transaction.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {customerName ?? customerEmail}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {competition?.title ?? "Unknown competition"}
                      </TableCell>
                      <TableCell className="font-medium text-brand-gold-dark">
                        {formatGBP(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString(
                          "en-GB",
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusPill tone={status.tone}>
                          {status.label}
                        </StatusPill>
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
