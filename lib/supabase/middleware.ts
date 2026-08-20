import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/sign-up", "/forgot-password"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // No-op until Supabase credentials are configured (see .env.local.example).
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refreshes the session cookie if needed. Do not run logic between
  // createServerClient and this call, or the session can be lost.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optimistic checks only: presence of a user, not role. Admin/ownership
  // checks happen server-side in layouts/DAL, which have DB access. There's
  // no separate member area to protect — regular users are embedded in the
  // public pages (Account Sheet) and gated per-action via requireUser().
  const path = request.nextUrl.pathname;
  const isProtected = path.startsWith("/admin");
  const isAuthRoute = AUTH_ROUTES.some((prefix) => path.startsWith(prefix));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    url.pathname = profile?.is_admin ? "/admin" : "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Optimistic: bounce non-admins away from /admin before the page even
  // loads. requireAdmin() in app/admin/layout.tsx is the real (DB-backed)
  // gate; this just avoids a flash of the admin shell for regular users.
  if (path.startsWith("/admin") && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
