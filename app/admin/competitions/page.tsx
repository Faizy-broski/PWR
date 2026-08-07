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
import { mockCompetitions } from "@/lib/data/competitions";
import { Plus } from "lucide-react";

export default function AdminCompetitionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Competitions
          </h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage prize competitions.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/competitions/new" />}>
          <Plus className="size-4" />
          New competition
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tickets sold</TableHead>
            <TableHead>Closes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockCompetitions.map((competition) => (
            <TableRow key={competition.id}>
              <TableCell className="font-medium">
                {competition.title}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    competition.status === "live" ? "default" : "secondary"
                  }
                >
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
                  render={<Link href={`/admin/competitions/${competition.id}`} />}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
