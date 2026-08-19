"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Trophy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MotionButton } from "@/components/admin/motion-button";
import { SearchInput } from "@/components/admin/search-input";
import { AdminFilterPills } from "@/components/admin/filter-pills";
import { StatusPill } from "@/components/admin/status-pill";
import {
  competitionStatusPill,
  formatCountdown,
} from "@/lib/admin/competition-status";
import { COMPETITION_CATEGORY_LABELS, type Competition } from "@/lib/types";

type FilterValue = "all" | "live" | "sold-out" | "draft" | "closed" | "drawn";

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Live", value: "live" },
  { label: "Sold out", value: "sold-out" },
  { label: "Draft", value: "draft" },
  { label: "Closed", value: "closed" },
  { label: "Drawn", value: "drawn" },
];

function filterValueFor(competition: Competition): FilterValue {
  if (competition.status === "live") {
    return competition.ticketsSold >= competition.totalTickets
      ? "sold-out"
      : "live";
  }
  return competition.status;
}

export function CompetitionsTable({
  competitions,
}: {
  competitions: Competition[];
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return competitions.filter((competition) => {
      const matchesSearch = query
        ? competition.title.toLowerCase().includes(query)
        : true;
      const matchesFilter =
        filter === "all" ? true : filterValueFor(competition) === filter;
      return matchesSearch && matchesFilter;
    });
  }, [competitions, search, filter]);

  if (competitions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border py-16 text-center">
        <Trophy className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No competitions yet — create your first one.
        </p>
        <MotionButton>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/admin/competitions/new" />}
          >
            <Plus className="size-4" />
            New competition
          </Button>
        </MotionButton>
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
          placeholder="Search competitions"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border py-16 text-center">
          <Trophy className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No competitions match your search.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competition</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tickets sold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ending</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((competition) => {
                const pill = competitionStatusPill(competition);
                return (
                  <TableRow
                    key={competition.id}
                    className="transition-colors hover:bg-brand-gold-light/5"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={competition.images[0]}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <span className="max-w-48 truncate">
                          {competition.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {COMPETITION_CATEGORY_LABELS[competition.category]}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {competition.ticketsSold.toLocaleString()} /{" "}
                      {competition.totalTickets.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={pill.tone}>{pill.label}</StatusPill>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {competition.status === "live"
                        ? formatCountdown(competition.closesAt)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/competitions/${competition.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        View
                        <ArrowRight className="size-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
