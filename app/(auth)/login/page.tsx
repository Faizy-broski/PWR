"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { AuthSocialButtons } from "@/components/auth/auth-social-buttons";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const justReset = searchParams.get("reset") === "success";

  return (
    <AuthShell
      eyebrow="Sign In"
      title="Good To See You Again."
      description="Enter your details to continue tracking your entries."
    >
      <form action={action} className="space-y-5">
        {justReset && (
          <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
            Password updated — sign in with your new password.
          </p>
        )}

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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-black/60">
            <Checkbox name="rememberMe" />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-black/60 underline-offset-2 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {state?.message && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}

        <Button
          type="submit"
          disabled={pending}
          className="bg-brand-gradient h-12 w-full rounded-full text-sm font-bold text-[#0D0C0C]"
        >
          {pending ? "Signing in…" : "Sign In"}
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
          New to PWR?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-[#0D0C0C] underline underline-offset-2"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
