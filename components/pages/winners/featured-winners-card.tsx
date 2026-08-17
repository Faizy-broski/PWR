import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeaturedWinner {
  id: string;
  name: string;
  location: string;
  prizeName: string;
  prizeValue: string;
  quote: string;
  image: string;
  imageAlt: string;
  href: string;
}

export function FeaturedWinnerCard({
  winner,
  className,
}: {
  winner: FeaturedWinner;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative grid gap-8 overflow-hidden rounded-3xl p-4 sm:p-6 lg:grid-cols-2 lg:items-center lg:gap-4 lg:p-6",
        className
      )}
    >

      <div className="relative aspect-4/3 h-[80%] w-full overflow-hidden rounded-2xl lg:aspect-square">
        <Image
          src={winner.image}
          alt={winner.imageAlt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-top"
        />
      </div>

      <div className="relative px-2 py-2 sm:px-4 lg:px-6">
         {/* watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <Image
          src="/pwr-logo.svg"
          alt=""
          aria-hidden
          width={480}
          height={232}
          className="h-auto w-[280px] opacity-3 sm:w-[380px] lg:w-[100%]"
          priority
        />
      </div>
        <p className="text-xs font-semibold tracking-[0.2em] text-brand-gold-light uppercase">
          PWR Winner
        </p>

        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-white uppercase sm:text-3xl">
          {winner.name} <span className="text-white/30">—</span>{" "}
          {winner.location}
        </h3>

        <div className="mt-6 flex items-center gap-10 border-t border-white/10 pt-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] text-white/40 uppercase">
              Won
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {winner.prizeName}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] text-white/40 uppercase">
              Prize Value
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-gold-light">
              {winner.prizeValue}
            </p>
          </div>
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-white/70">
          &ldquo;{winner.quote}&rdquo;
        </p>

        <Link
          href={winner.href}
          className="group mt-5 inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-brand-gold-light uppercase transition-colors hover:text-brand-gold-light/80"
        >
          Read {winner.name}&apos;s Story
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}