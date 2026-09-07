import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { AdminPageHeader } from "@/components/admin/page-header";
import { NotificationTemplateCard } from "@/components/admin/notification-template-card";
import { getNotificationTemplates } from "@/lib/data/notifications";

export default async function AdminNotificationsPage() {
  const templates = await getNotificationTemplates();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Notifications"
        description="Edit the copy used for entry confirmations and draw results. No email is sent yet — these are logged and shown in the admin bell."
      />

      <Reveal delay={0.1}>
        <RevealGroup className="grid gap-6 lg:grid-cols-2">
          {templates.map((template) => (
            <RevealItem key={template.type}>
              <NotificationTemplateCard template={template} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Reveal>
    </div>
  );
}
