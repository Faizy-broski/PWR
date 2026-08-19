import { Reveal } from "@/components/motion/reveal";
import { AdminPageHeader } from "@/components/admin/page-header";
import { UsersTable } from "@/components/admin/users-table";
import { getAllUsers } from "@/lib/data/entries";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customers"
        description="Everyone registered on the platform."
      />

      <Reveal delay={0.1}>
        <UsersTable users={users} />
      </Reveal>
    </div>
  );
}
