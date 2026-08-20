import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createClient } from "@/lib/supabase/server";

// Only reachable with a valid recovery session, which app/auth/confirm's
// verifyOtp() call establishes before redirecting here — landing on this
// page any other way (bookmarked, expired link, already used) means there's
// no session to set a password against.
export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AuthShell
      eyebrow="Reset Password"
      title="Choose A New Password."
      description="Enter a new password for your account below."
    >
      {user ? (
        <ResetPasswordForm />
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-black/60">
            This reset link is invalid or has expired. Request a new one to
            continue.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/forgot-password" />}
            className="bg-brand-gradient h-12 w-full rounded-full text-sm font-bold text-[#0D0C0C]"
          >
            Request a new link
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
