import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 p-4 sm:p-6">{children}</div>
    </div>
  );
}
