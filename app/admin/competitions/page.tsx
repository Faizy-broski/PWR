import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { COMPETITION_CATEGORY_LABELS } from "@/lib/types";
import { getAllCompetitions } from "@/lib/data/competitions";
import { Plus, Trophy } from "lucide-react";

const STATUS_VARIANT = {
  live: "default",
  draft: "secondary",
  closed: "outline",
  drawn: "outline",
} as const;

export default async function AdminCompetitionsPage() {
  const competitions = await getAllCompetitions();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Competitions
          </h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage prize competitions.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/admin/competitions/new" />}
        >
          <Plus className="size-4" />
          New competition
        </Button>
      </div>

      {competitions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <Trophy className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No competitions yet — create your first one.
          </p>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/admin/competitions/new" />}
          >
            <Plus className="size-4" />
            New competition
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competition</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tickets sold</TableHead>
                <TableHead>Closes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitions.map((competition) => (
                <TableRow key={competition.id}>
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
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[competition.status]}>
                      {competition.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {competition.ticketsSold.toLocaleString()} /{" "}
                    {competition.totalTickets.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(competition.closesAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      render={
                        <Link href={`/admin/competitions/${competition.id}`} />
                      }
                    >
                      Edit
                    </Button>
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
