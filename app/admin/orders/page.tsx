import { Reveal } from "@/components/motion/reveal";
import { AdminPageHeader } from "@/components/admin/page-header";
import { OrdersTable } from "@/components/admin/orders-table";
import { getAllTransactions } from "@/lib/data/entries";

export default async function AdminOrdersPage() {
  const orders = await getAllTransactions();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Orders"
        description="All ticket purchases across every competition."
      />

      <Reveal delay={0.1}>
        <OrdersTable orders={orders} />
      </Reveal>
    </div>
  );
}
