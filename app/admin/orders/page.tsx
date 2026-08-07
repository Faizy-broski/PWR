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
  customer: `customer${index + 1}@example.com`,
  competition,
  amount: competition.ticketPrice * 3,
  status: "paid" as const,
}));

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-muted-foreground">
          All ticket purchases across every competition.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Competition</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell className="text-muted-foreground">
                {order.customer}
              </TableCell>
              <TableCell>{order.competition.title}</TableCell>
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
