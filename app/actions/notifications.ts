"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export type NotificationTemplateFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

const TemplateSchema = z.object({
  type: z.enum(["entry_confirmed", "competition_drawn", "you_won"]),
  title: z.string().trim().min(1, { error: "Add a title." }),
  body: z.string().trim().min(1, { error: "Add a body." }),
});

export async function updateNotificationTemplate(
  _state: NotificationTemplateFormState,
  formData: FormData,
): Promise<NotificationTemplateFormState> {
  await requireAdmin();

  const validated = TemplateSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    body: formData.get("body"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { type, title, body } = validated.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("notification_templates")
    .update({ title, body, updated_at: new Date().toISOString() })
    .eq("type", type);

  if (error) {
    return { message: error.message };
  }

  revalidatePath("/admin/notifications");
  return { message: "Saved." };
}
