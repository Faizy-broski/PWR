import { createClient } from "@/lib/supabase/server";

export interface AdminNotification {
  id: string;
  type: "entry_confirmed" | "competition_drawn" | "you_won";
  title: string;
  body: string;
  createdAt: string;
}

// Most recent notifications across every user, for the admin bell — not
// scoped to the signed-in admin, since these log platform activity (entries,
// draws) rather than being addressed to the admin themselves.
export async function getRecentNotifications(
  limit = 5,
): Promise<AdminNotification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
  }));
}

export interface NotificationTemplate {
  type: "entry_confirmed" | "competition_drawn" | "you_won";
  title: string;
  body: string;
  updatedAt: string;
}

export async function getNotificationTemplates(): Promise<
  NotificationTemplate[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notification_templates")
    .select("*")
    .order("type", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    type: row.type,
    title: row.title,
    body: row.body,
    updatedAt: row.updated_at,
  }));
}
