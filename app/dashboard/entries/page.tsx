import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockCompetitions } from "@/lib/data/competitions";

const entries = mockCompetitions.map((competition, index) => ({
  id: `entry_${index}`,
  competition,
  ticketNumbers: [1024 + index, 1025 + index, 1026 + index],
}));

export default function EntriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Entries</h1>
        <p className="mt-1 text-muted-foreground">
          Every competition you&apos;ve entered, live and closed.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Competition</TableHead>
            <TableHead>Ticket numbers</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">
                {entry.competition.title}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {entry.ticketNumbers.join(", ")}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    entry.competition.status === "live" ? "default" : "secondary"
                  }
                >
                  {entry.competition.status === "live" ? "Live" : "Closed"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
