"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { AuthPasswordInput } from "@/components/auth/auth-password-input";
import { resetPassword } from "@/app/actions/auth";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(resetPassword, undefined);

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-[11px] font-semibold tracking-[0.15em] text-black/50 uppercase"
        >
          New Password
        </label>
        <AuthPasswordInput id="password" name="password" required />
        {state?.errors?.password && (
          <p className="text-sm text-destructive">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-[11px] font-semibold tracking-[0.15em] text-black/50 uppercase"
        >
          Confirm New Password
        </label>
        <AuthPasswordInput
          id="confirmPassword"
          name="confirmPassword"
          required
        />
        {state?.errors?.confirmPassword && (
          <p className="text-sm text-destructive">
            {state.errors.confirmPassword[0]}
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
        {pending ? "Saving…" : "Save New Password"}
      </Button>
    </form>
  );
}
