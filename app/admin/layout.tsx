import { AdminSidebar } from "@/components/admin/sidebar";
import { requireAdmin } from "@/lib/supabase/dal";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAdmin();

  return (
    <div className="flex flex-1 flex-col bg-muted/30">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:gap-8 lg:p-8">
        <AdminSidebar
          name={profile.full_name ?? profile.email}
          email={profile.email}
        />
        <div className="min-w-0 flex-1">{children}</div>
      </main>
    </div>
  );
}
