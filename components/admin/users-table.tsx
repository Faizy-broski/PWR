"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
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
import type { getAllUsers } from "@/lib/data/entries";

type User = Awaited<ReturnType<typeof getAllUsers>>[number];

type FilterValue = "all" | "admin" | "member";

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Member", value: "member" },
];

export function UsersTable({ users }: { users: User[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch = query
        ? [user.fullName, user.email]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(query))
        : true;
      const matchesFilter =
        filter === "all" ? true : filter === "admin" ? user.isAdmin : !user.isAdmin;
      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border py-16 text-center">
        <Users className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No users yet.</p>
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
          placeholder="Search customers"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border py-16 text-center">
          <Users className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No customers match your search.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Entries</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow
                  key={user.id}
                  className="transition-colors hover:bg-brand-gold-light/5"
                >
                  <TableCell className="font-medium">
                    {user.fullName ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.entryCount}
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={user.isAdmin ? "warm" : "muted"}>
                      {user.isAdmin ? "Admin" : "Member"}
                    </StatusPill>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
