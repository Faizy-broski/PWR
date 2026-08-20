"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/auth/auth-shell";
import { requestPasswordReset } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(
    requestPasswordReset,
    undefined,
  );

  return (
    <AuthShell
      eyebrow="Forgot Password"
      title="Reset Your Password."
      description="Enter the email on your account and we'll send you a link to reset it."
    >
      {state?.success ? (
        <div className="space-y-6">
          <p className="text-sm text-black/60">
            If an account exists for that email, we&apos;ve sent a link to
            reset your password. Check your inbox (and spam folder).
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/login" />}
            variant="outline"
            className="h-12 w-full rounded-full text-sm font-bold"
          >
            Back to sign in
          </Button>
        </div>
      ) : (
        <form action={action} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-[11px] font-semibold tracking-[0.15em] text-black/50 uppercase"
            >
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@pwr.today"
              required
              className="h-12 rounded-full border-black/10 px-5"
            />
            {state?.errors?.email && (
              <p className="text-sm text-destructive">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="bg-brand-gradient h-12 w-full rounded-full text-sm font-bold text-[#0D0C0C]"
          >
            {pending ? "Sending…" : "Send Reset Link"}
          </Button>

          <p className="pt-2 text-center text-sm text-black/50">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#0D0C0C] underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
