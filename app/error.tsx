"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No error-tracking service wired up yet — at minimum, don't lose this
    // silently. Wire up Sentry/similar here before launch.
    console.error(error);
  }, [error]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      tl.fromTo(
        glitchRef.current,
        { opacity: 0, scale: 1.15, skewX: 8 },
        { opacity: 1, scale: 1, skewX: 0, duration: 0.5, ease: "power4.out" }
      ).fromTo(
        bodyRef.current?.children ?? [],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" },
        "-=0.2"
      );

      // Periodic glitch flicker on the headline.
      const glitch = gsap.timeline({ repeat: -1, repeatDelay: 3.2 });
      glitch
        .to(glitchRef.current, { x: -4, skewX: 6, duration: 0.05 })
        .to(glitchRef.current, { x: 3, skewX: -4, duration: 0.05 })
        .to(glitchRef.current, { x: -2, skewX: 2, duration: 0.05 })
        .to(glitchRef.current, { x: 0, skewX: 0, duration: 0.05 });

      gsap.to(blobARef.current, {
        x: 40,
        y: -30,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(blobBRef.current, {
        x: -30,
        y: 40,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#0D0C0C] px-4 py-24 text-center"
    >
      <div
        ref={blobARef}
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 size-80 rounded-full bg-destructive/15 blur-3xl"
      />
      <div
        ref={blobBRef}
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-32 size-96 rounded-full bg-brand-gold-light/10 blur-3xl"
      />

      <h1
        ref={glitchRef}
        className="relative text-7xl font-extrabold tracking-tight text-white sm:text-8xl"
        style={{ opacity: 0 }}
      >
        <span className="text-brand-gradient">Error</span>
      </h1>

      <div ref={bodyRef} className="relative mt-6 flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Something went wrong
        </h2>
        <p className="max-w-md text-white/60">
          We hit an unexpected error. Try again, or head back home.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button variant="gradient" className="rounded-full px-6" onClick={retry}>
            Try again
          </Button>
          <Button
            variant="outline-transparent"
            className="rounded-full px-6"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
