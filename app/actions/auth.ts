"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

export type AuthFormState =
  | {
      errors?: {
        fullName?: string[];
        email?: string[];
        password?: string[];
        phone?: string[];
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
  // UK mobile format kept loose (allows +44 or 0-prefixed, spaces) since PWR
  // hasn't confirmed which SMS provider/number format it will send from.
  phone: z
    .string()
    .trim()
    .min(1, { error: "Enter your mobile number." })
    .regex(/^(\+?\d[\d\s]{7,14}\d)$/, {
      error: "Enter a valid mobile number.",
    }),
  marketingEmailConsent: z.coerce.boolean(),
  marketingSmsConsent: z.coerce.boolean(),
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
    phone: formData.get("phone"),
    marketingEmailConsent: formData.get("marketingEmailConsent") === "on",
    marketingSmsConsent: formData.get("marketingSmsConsent") === "on",
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const {
    fullName,
    email,
    password,
    phone,
    marketingEmailConsent,
    marketingSmsConsent,
  } = validated.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        marketing_email_consent: marketingEmailConsent,
        marketing_sms_consent: marketingSmsConsent,
      },
    },
  });

  if (error) {
    return { message: error.message };
  }

  // Best-effort — a welcome email failing shouldn't block account creation.
  await sendWelcomeEmail(email, fullName).catch((err) =>
    console.error("Failed to send welcome email:", err),
  );

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

// Google/Apple credentials are configured on the Supabase Auth provider
// dashboard, not in this codebase — see AGENTS.md items 19-20. Once PWR
// enables a provider there, these two actions work with no code changes.
async function signInWithOAuth(provider: "google" | "apple") {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${siteUrl}/auth/callback` },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth-unavailable");
  }

  redirect(data.url);
}

export async function signInWithGoogle() {
  await signInWithOAuth("google");
}

export async function signInWithApple() {
  await signInWithOAuth("apple");
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
