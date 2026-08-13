import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden bg-transparent pt-14 pb-24 sm:py-28">

      <div className="container relative text-center">
        <Reveal direction="down" distance={12} duration={0.5}>
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand-gold-light uppercase">
            — Your Move
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="flex flex-wrap items-baseline justify-center gap-x-3 text-3xl max-w-xl mx-auto font-extrabold text-white uppercase sm:text-4xl lg:text-7xl">
            <span>Your Next Win</span>
            <span className="font-script text-4xl text-brand-gold-light sm:text-5xl lg:text-7xl">
              Starts
            </span>
            <span>Here.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/60 sm:text-base">
            Explore today&apos;s competitions and find your chance to win.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Magnetic strength={0.3}>
              <Button
                variant="gradient"
                nativeButton={false}
                render={<Link href="/competitions" />}
                className="h-11 rounded-full px-8 text-xs font-bold tracking-widest uppercase"
              >
                View Competitions
              </Button>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Button
                variant="outline-transparent"
                nativeButton={false}
                render={<Link href="/#how-it-works" />}
                className="h-11 rounded-full px-8 text-xs font-bold tracking-widest uppercase"
              >
                How It Works
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
