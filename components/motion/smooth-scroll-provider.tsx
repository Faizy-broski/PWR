"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

function getHeaderOffset() {
  const header = document.querySelector("header");
  return (header?.getBoundingClientRect().height ?? 0) + 16;
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Intercept same-page anchor clicks (e.g. navbar links to "#how-it-works")
    // so they scroll smoothly through Lenis instead of jumping instantly.
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement)?.closest?.(
        "a[href]"
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }

      if (url.pathname !== window.location.pathname || !url.hash) return;

      const target = document.querySelector(url.hash);
      if (!target) return;

      event.preventDefault();
      event.stopPropagation();

      if (window.location.hash !== url.hash) {
        window.history.pushState(null, "", url.hash);
      }
      lenis.scrollTo(target as HTMLElement, {
        offset: -getHeaderOffset(),
        duration: 1.4,
      });
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Covers links that jump to a section on a different page (e.g. footer's
  // "/#how-it-works" clicked from another route) — smooth-scroll to the
  // hash once the destination page has landed and rendered.
  useEffect(() => {
    if (!window.location.hash) return;
    const timeout = setTimeout(() => {
      const lenis = lenisRef.current;
      const target = document.querySelector(window.location.hash);
      if (!lenis || !target) return;
      lenis.scrollTo(target as HTMLElement, {
        offset: -getHeaderOffset(),
        duration: 1.4,
      });
    }, 80);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return <>{children}</>;
}
