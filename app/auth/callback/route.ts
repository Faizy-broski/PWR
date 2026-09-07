import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Where Google/Apple sign-in redirects back to after the provider's own
// consent screen (see signInWithGoogle/signInWithApple in
// app/actions/auth.ts). OAuth uses the PKCE `code` param, unlike the
// token_hash used by email links (see app/auth/confirm/route.ts).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=oauth-unavailable", origin),
  );
}
