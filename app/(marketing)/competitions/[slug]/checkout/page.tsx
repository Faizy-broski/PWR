import { notFound } from "next/navigation";
import { getCompetitionBySlug } from "@/lib/data/competitions";
import { requireUser } from "@/lib/supabase/dal";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export default async function CheckoutPage({
  params,
}: PageProps<"/competitions/[slug]/checkout">) {
  const { slug } = await params;

  // Requires an authenticated user; redirects to /login?next=... otherwise.
  await requireUser();

  const competition = await getCompetitionBySlug(slug);
  const hasStarted = competition && new Date(competition.startsAt) <= new Date();
  if (!competition || competition.status !== "live" || !hasStarted) notFound();

  return (
    <div className="dark min-h-screen -mt-18 bg-background pt-18 text-foreground sm:-mt-20 sm:pt-20 lg:-mt-24 lg:pt-24">
      <CheckoutForm competition={competition} />
    </div>
  );
}
