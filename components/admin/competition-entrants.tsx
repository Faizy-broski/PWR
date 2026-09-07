"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/admin/search-input";
import { searchEntrants, type CompetitionEntrant } from "@/app/actions/entrants";

const PAGE_SIZE = 10;

// Always shown while editing a competition (any status) — see
// app/actions/entrants.ts#searchEntrants, backed by
// search_competition_entrants() in
// supabase/migrations/20260826000001_draw_candidate_and_commit.sql.
export function CompetitionEntrants({
  competitionId,
}: {
  competitionId: string;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [entrants, setEntrants] = useState<CompetitionEntrant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    const timeout = setTimeout(
      async () => {
        setLoading(true);
        const result = await searchEntrants(competitionId, search, page);
        if (requestId.current === id) {
          setEntrants(result.entrants);
          setTotalCount(result.totalCount);
          setLoading(false);
        }
      },
      search ? 300 : 0,
    );
    return () => clearTimeout(timeout);
  }, [competitionId, search, page]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "entrant" : "entrants"}
        </p>
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search entrants"
        />
      </div>

      {!loading && entrants.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-10 text-center">
          <Users className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {search ? "No entrants match your search." : "No entrants yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ticket(s)</TableHead>
                <TableHead>Entered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entrants.map((entrant) => (
                <TableRow key={entrant.entryId}>
                  <TableCell className="font-medium">
                    {entrant.fullName ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entrant.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entrant.ticketNumbers.map((n) => `#${n}`).join(", ")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(entrant.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
