import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TestimonialCard } from "@/components/landing/testimonials/testimonial-card";
import { testimonials } from "@/lib/data/testimonials";
import { cn } from "@/lib/utils";

export function TestimonialsHeading({ className }: { className?: string }) {
  return (
    <div className={cn("container", className)}>
      <div className="mx-auto max-w-xl text-center">
        <Reveal direction="down" distance={12} duration={0.5}>
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand-gold-light uppercase">
            — Community
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl leading-[1.05] font-extrabold text-white uppercase sm:text-4xl lg:text-5xl">
            Loved By <span className="italic">Our</span> Community
          </h2>
        </Reveal>
      </div>
    </div>
  );
}

export function TestimonialsGrid({ className }: { className?: string }) {
  return (
    <div className={cn("container", className)}>
      <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {testimonials.map((testimonial) => (
          <RevealItem key={testimonial.name}>
            <TestimonialCard testimonial={testimonial} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="pt-16 pb-10 sm:pt-20 lg:pt-24">
      <TestimonialsHeading />
      <TestimonialsGrid className="mt-10 sm:mt-12" />
    </section>
  );
}
