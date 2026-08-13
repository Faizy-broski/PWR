"use server";

import * as z from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      success?: boolean;
    }
  | undefined;

const ProfileSchema = z.object({
  fullName: z.string().trim().min(2, { error: "Enter your full name." }),
  phone: z
    .string()
    .trim()
    .max(30, { error: "Phone number is too long." })
    .optional()
    .or(z.literal("")),
});

export async function updateProfile(
  _state: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const profile = await requireUser();

  const validated = ProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: validated.data.fullName,
      phone: validated.data.phone || null,
    })
    .eq("id", profile.id);

  if (error) {
    return { message: error.message };
  }

  // No revalidatePath: the Account Sheet re-fetches on open, and the
  // caller (ProfileForm) calls router.refresh() to update the navbar name.
  return { success: true };
}
