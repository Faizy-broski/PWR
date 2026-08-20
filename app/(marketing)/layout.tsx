import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getCurrentUser } from "@/lib/supabase/dal";

// Public-facing chrome (home, competitions, login/sign-up). Not applied to
// /admin, which renders its own sidebar layout. Logged-in users manage their
// entries, orders, and profile on the full /account page (see
// app/(marketing)/account/page.tsx), linked from the navbar's avatar.
export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUser();

  return (
    <>
      <Navbar
        user={
          profile
            ? {
                fullName: profile.full_name ?? "",
                email: profile.email,
                phone: profile.phone ?? "",
                isAdmin: profile.is_admin,
              }
            : null
        }
      />
      {/*
        The navbar is `fixed` (see components/layout/navbar.tsx) so it can
        stay pinned while transparent-over-hero — `sticky` would reserve its
        own space in flow and leave a gap above the hero instead of letting
        it bleed up underneath. This padding gives every other page room to
        clear it; Hero/CompetitionsHero cancel it back out with a matching
        negative margin so *they* still start at the true top.
      */}
      <main className="flex flex-1 flex-col pt-18 sm:pt-20 lg:pt-24">
        {children}
      </main>
      <Footer />
    </>
  );
}
