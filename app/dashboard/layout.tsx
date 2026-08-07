import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:flex-row">
      <DashboardSidebar />
      <div className="flex-1 p-4 sm:p-6">{children}</div>
    </div>
  );
}
