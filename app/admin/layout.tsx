import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { AdminRouteProgressBar } from "@/components/admin/route-progress-bar";
import { requireAdmin } from "@/lib/supabase/dal";
import { getAllCompetitions } from "@/lib/data/competitions";
import { getRecentNotifications } from "@/lib/data/notifications";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, competitions, notifications] = await Promise.all([
    requireAdmin(),
    getAllCompetitions(),
    getRecentNotifications(),
  ]);

  const name = profile.full_name ?? profile.email;

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 lg:flex-row">
      <AdminRouteProgressBar />
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
        <AdminTopbar
          name={name}
          competitions={competitions.map((c) => ({ id: c.id, title: c.title }))}
          notifications={notifications}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
