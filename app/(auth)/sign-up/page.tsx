"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { AuthSocialButtons } from "@/components/auth/auth-social-buttons";
import { signup } from "@/app/actions/auth";

export default function SignUpPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <AuthShell
      eyebrow="Sign Up"
      title="Join The Winning Side."
      description="Create your account to start entering competitions."
    >
      <form action={action} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="text-[11px] font-semibold tracking-[0.15em] text-black/50 uppercase"
          >
            Full Name
          </label>
          <Input
            id="fullName"
            name="fullName"
            required
            className="h-12 rounded-full border-black/10 px-5"
          />
          {state?.errors?.fullName && (
            <p className="text-sm text-destructive">
              {state.errors.fullName[0]}
            </p>
          )}
        </div>

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
            <p className="text-sm text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-[11px] font-semibold tracking-[0.15em] text-black/50 uppercase"
          >
            Password
          </label>
          <AuthPasswordInput id="password" name="password" required />
          {state?.errors?.password && (
            <p className="text-sm text-destructive">
              {state.errors.password[0]}
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
          {pending ? "Signing up…" : "Create Account"}
        </Button>

        <div className="flex items-center gap-4 py-1">
          <span className="h-px flex-1 bg-black/10" />
          <span className="text-[10px] font-semibold tracking-[0.15em] text-black/40 uppercase">
            Or continue with
          </span>
          <span className="h-px flex-1 bg-black/10" />
        </div>

        <AuthSocialButtons />

        <p className="pt-2 text-center text-sm text-black/50">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#0D0C0C] underline underline-offset-2"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
