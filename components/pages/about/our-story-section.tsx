import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { Parallax } from "@/components/motion/parallax";
import { LineDraw } from "@/components/motion/line-draw";

export function OurStorySection({
  eyebrow = "Our Story",
  titleTop = "It Started With",
  titleAccent = "A Simple Idea",
  paragraphs = [
    "PWR was built around a simple belief — winning should mean more than taking home a prize.",
    "It should create moments people remember. It should create opportunities.",
    "And it should give us the ability to make a positive difference beyond the competition itself.",
  ],
  image = "/about/our-story.jpg",
  imageAlt = "Two friends celebrating a PWR win together",
}: {
  eyebrow?: string;
  titleTop?: string;
  titleAccent?: string;
  paragraphs?: string[];
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal direction="down" distance={12} duration={0.5}>
            <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-brand-gold-light uppercase">
              — {eyebrow}
            </p>
          </Reveal>

          <h2 className="text-3xl leading-[1.1] font-extrabold text-white uppercase sm:text-4xl lg:text-5xl">
            <TextReveal text={titleTop} delay={0.1} className="block" />
            <TextReveal
              text={titleAccent}
              delay={0.3}
              className="block font-script"
            />
          </h2>

          <LineDraw className="mt-5" delay={0.5} />

          <RevealGroup className="mt-6 space-y-4">
            {paragraphs.map((paragraph, i) => (
              <RevealItem key={i}>
                <p className="max-w-[46ch] text-sm leading-relaxed text-white/60 sm:text-[15px]">
                  {paragraph}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal direction="left" distance={32}>
          <Parallax
            className="aspect-4/3 w-full rounded-3xl"
            speed={0.15}
            scale={1.1}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
