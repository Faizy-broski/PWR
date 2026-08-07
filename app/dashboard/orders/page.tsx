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

const orders = mockCompetitions.map((competition, index) => ({
  id: `PWR-${1000 + index}`,
  competition,
  amount: competition.ticketPrice * 3,
  date: competition.createdAt,
  status: "paid" as const,
}));

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Order History
        </h1>
        <p className="mt-1 text-muted-foreground">
          Receipts for every ticket purchase.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Competition</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.competition.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(order.date).toLocaleDateString("en-GB")}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: "GBP",
                }).format(order.amount)}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Paid</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
