import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const users = [
  { id: "1", email: "faizan@pwr.co.uk", entries: 12, isAdmin: true },
  { id: "2", email: "customer1@example.com", entries: 4, isAdmin: false },
  { id: "3", email: "customer2@example.com", entries: 1, isAdmin: false },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-muted-foreground">
          Everyone registered on the platform.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Entries</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.entries}
              </TableCell>
              <TableCell>
                <Badge variant={user.isAdmin ? "default" : "secondary"}>
                  {user.isAdmin ? "Admin" : "Member"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
