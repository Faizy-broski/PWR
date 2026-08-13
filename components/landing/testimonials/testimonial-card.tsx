import { BadgeCheck, Star } from "lucide-react";
import type { Testimonial } from "@/lib/data/testimonials";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { quote, name, location, rating, verified } = testimonial;

  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-[#171717] p-6">
      <div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="size-3.5 text-brand-gold-light"
              fill={i < rating ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-white/80">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      <span className="h-px bg-white/12"/>

      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm font-bold text-white">{name}</div>
          <div className="text-xs text-white/50">{location}</div>
        </div>
        {verified ? (
          <span className="flex items-center gap-1 text-[12px] font-semibold tracking-wide text-white/50 uppercase">
            <BadgeCheck className="size-4 text-brand-gold-light" />
            Verified
          </span>
        ) : null}
      </div>
    </div>
  );
}
