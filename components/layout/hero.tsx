"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Parallax } from "@/components/motion/parallax";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-black sm:min-h-[720px] lg:min-h-screen">
      <Parallax className="absolute inset-0" speed={0.18} scale={1.18}>
        <Image
          src="/hero-bg.png"
          alt="PWR volunteers planting trees together"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </Parallax>
      {/* <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" /> */}

      <div className="container relative pt-24 pb-16 sm:pt-28">
        <div className="max-w-xl">
          <Reveal direction="down" distance={16} duration={0.6}>
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">
              — UK Competitions · Drawn Live
            </p>
          </Reveal>

          <h1 className="text-4xl leading-[1.05] font-extrabold text-white sm:text-6xl lg:text-7xl">
            <TextReveal
              text="Big prizes."
              className="block uppercase"
              delay={0.1}
            />
            <motion.span
              className="font-script uppercase block text-brand-gradient text-3xl sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              Real
            </motion.span>
            <TextReveal
              text="Competitions."
              className="block uppercase"
              delay={0.75}
            />
          </h1>

          <Reveal delay={1.1} duration={0.6}>
            <p className="mt-6 max-w-md text-sm text-white/70 sm:text-base">
              Performance cars, tax-free cash and luxury prizes — drawn live,
              handed over in person and published for everyone to see.
            </p>
          </Reveal>

          <Reveal delay={1.25} duration={0.6}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.3}>
                <Button
                  variant="gradient"
                  nativeButton={false}
                  render={<Link href="/competitions" />}
                  className="h-11 rounded-full px-7 text-xs font-bold tracking-widest uppercase"
                >
                  View Competitions
                </Button>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Button
                  variant="outline-transparent"
                  nativeButton={false}
                  render={<Link href="/#how-it-works" />}
                  className="h-11 rounded-full px-7 text-xs font-bold tracking-widest uppercase"
                >
                  How It Works
                </Button>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
