"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState =
  | {
      errors?: {
        fullName?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

const SignUpSchema = z.object({
  fullName: z.string().trim().min(2, { error: "Enter your full name." }),
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." }),
});

const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z.string().min(1, { error: "Enter your password." }),
});

export async function signup(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validated = SignUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { fullName, email, password } = validated.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return { message: error.message };
  }

  redirect("/");
}

export async function login(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(
    validated.data,
  );

  if (error || !data.user) {
    return { message: "Invalid email or password." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", data.user.id)
    .single();

  redirect(profile?.is_admin ? "/admin" : "/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

const ForgotPasswordSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
});

export type ForgotPasswordState =
  | {
      errors?: { email?: string[] };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function requestPasswordReset(
  _state: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const validated = ForgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  await supabase.auth.resetPasswordForEmail(validated.data.email, {
    redirectTo: `${siteUrl}/auth/confirm?next=/reset-password`,
  });

  // Report success either way — confirming/denying that an email is
  // registered would let this form be used to enumerate accounts.
  return { success: true };
}

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(1, { error: "Confirm your new password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordState =
  | {
      errors?: { password?: string[]; confirmPassword?: string[] };
      message?: string;
    }
  | undefined;

// Only succeeds when called with an active session — which the /auth/confirm
// route establishes from the recovery link's token before redirecting here
// (see app/auth/confirm/route.ts). No session means the link was invalid,
// already used, or expired.
export async function resetPassword(
  _state: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const validated = ResetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "This reset link has expired. Request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: validated.data.password,
  });

  if (error) {
    return { message: error.message };
  }

  // Sign out of the recovery session so they log back in with the new
  // password, rather than silently staying signed in.
  await supabase.auth.signOut();
  redirect("/login?reset=success");
}
