import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

export function CommunitySection({
  eyebrow = "Community",
  titleTop = "It Started With",
  titleAccent = "A Simple Idea",
  heading = "PWR Is About People.",
  description = "Our community is at the heart of everything we do. As PWR grows, so does our ability to support people, create opportunities and contribute to communities.",
  bannerSrc = "/about/community.png",
  bannerAlt = "The PWR team planting trees together with the community, PWR van and marquee in the background",
}: {
  eyebrow?: string;
  titleTop?: string;
  titleAccent?: string;
  heading?: string;
  description?: string;
  bannerSrc?: string;
  bannerAlt?: string;
}) {
  return (
    <section className="bg-[#0D0C0C] py-16 sm:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-end lg:gap-16">
          <Reveal duration={0.5}>
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-brand-gold-dark" aria-hidden />
                <p className="text-[11px] font-semibold tracking-[0.25em] text-brand-gold-light uppercase">
                  {eyebrow}
                </p>
              </div>

              <h2 className="mt-4 text-3xl leading-[1.1] font-extrabold text-white uppercase sm:text-4xl lg:text-5xl">
                {titleTop}
                <br />
                <span className="font-script">{titleAccent}</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="lg:pb-2">
              <h3 className="text-base font-bold text-white sm:text-lg">
                {heading}
              </h3>
              <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-white/50">
                {description}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="relative mt-10 aspect-3/2 w-full overflow-hidden rounded-3xl sm:mt-12 sm:aspect-24/10">
            <Image
              src={bannerSrc}
              alt={bannerAlt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}