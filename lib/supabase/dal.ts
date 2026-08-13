import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Secure checks (DB-backed), for use in layouts/pages/server actions/route
// handlers. Proxy only does optimistic cookie-presence checks; this is the
// real gate. Memoized per-request with React's cache().
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile ?? null;
});

export async function requireUser() {
  const profile = await getCurrentUser();
  if (!profile) redirect("/login");
  return profile;
}

export async function requireAdmin() {
  const profile = await requireUser();
  if (!profile.is_admin) redirect("/");
  return profile;
}
