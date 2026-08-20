import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Where Supabase's password-recovery (and other OTP-based) email links
// land: it verifies the token server-side and establishes a session via
// cookies, then hands off to `next` — the URL fragment/hash tokens Supabase
// used to use for this don't reach the server at all, so this token_hash +
// verifyOtp() exchange is the SSR-compatible way to do it.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(
    new URL("/forgot-password?error=invalid-link", origin),
  );
}
