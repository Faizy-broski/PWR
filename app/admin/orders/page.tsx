import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";
import { getAllTransactions } from "@/lib/data/entries";

const STATUS_VARIANT = {
  paid: "default",
  pending: "secondary",
  failed: "destructive",
  refunded: "secondary",
} as const;

export default async function AdminOrdersPage() {
  const orders = await getAllTransactions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-muted-foreground">
          All ticket purchases across every competition.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <Receipt className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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
              {orders.map(({ transaction, competition, customerEmail }) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {customerEmail}
                  </TableCell>
                  <TableCell>
                    {competition?.title ?? "Unknown competition"}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    }).format(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[transaction.status]}>
                      {transaction.status[0].toUpperCase() +
                        transaction.status.slice(1)}
                    </Badge>
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
