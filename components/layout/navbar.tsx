"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, User } from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AccountSheet } from "@/components/account/account-sheet";
import { AmbientBlobs } from "@/components/motion/ambient-blobs";

const links = [
  { href: "/competitions", label: "Competitions" },
  { href: "/winners", label: "Winners" },
  { href: "/about", label: "About PWR" },
  { href: "/contact", label: "Contact Us" },
];

export type NavbarUser = {
  fullName: string;
  email: string;
  phone: string;
  isAdmin: boolean;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Navbar({ user }: { user: NavbarUser | null }) {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Re-fires each time the sheet mounts (Base UI unmounts the popup after
  // its own close transition finishes), so this plays fresh on every open.
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    if (!menu) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        menu.children,
        { opacity: 0, x: 24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.06,
          delay: 0.1,
          ease: "power3.out",
        },
      );
    }, menu);

    return () => ctx.revert();
  }, [open]);
  // This Navbar is only ever rendered inside the (marketing) route group's
  // layout — every marketing page now sits on a dark background that
  // bleeds up behind the fixed header (see e.g. app/(marketing)/about,
  // /contact, /winners, and components/layout/legal-page.tsx), so the
  // transparent-then-solid-on-scroll treatment applies everywhere here.
  const transparent = !scrolled;

  useEffect(() => {
    // Threshold is captured once (not read from window.innerHeight inside
    // the scroll handler) — recomputing it on every scroll event let it
    // drift as mobile browsers show/hide their address bar mid-scroll,
    // which could flip `scrolled` back and forth near the boundary.
    let threshold = window.innerHeight * 0.75;
    let ticking = false;

    // rAF-throttled: Lenis (see smooth-scroll-provider.tsx) already fires a
    // native `scroll` event on every animation frame during its smooth
    // scroll, plus its own rAF loop and GSAP's ScrollTrigger.update — doing
    // full work (and a React re-render) on every single one of those was
    // stacking a second per-frame job on top and causing jank.
    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled((prev) => {
          const next = window.scrollY > threshold;
          return prev === next ? prev : next;
        });
        ticking = false;
      });
    }

    function handleResize() {
      threshold = window.innerHeight * 0.75;
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
    // Depends on pathname so this re-runs (and recomputes immediately) on
    // every navigation, not just once on mount.
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        transparent
          ? "bg-transparent"
          : "border-b border-border/60 bg-background/80 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl supports-backdrop-filter:bg-background/60 text-[#0B0B0B]"
      )}
    >
      <nav
        className={cn(
          "container relative flex items-center justify-between transition-[height] duration-300",
          transparent ? "h-18 sm:h-20 lg:h-18" : "h-16 sm:h-18 lg:h-16"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 -bottom-px h-px bg-brand-gradient opacity-0 transition-opacity duration-300",
            !transparent && "opacity-100"
          )}
        />
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/pwr-logo.svg"
            alt="PWR"
            width={120}
            height={58}
            className={cn(
              "h-11 w-auto sm:h-12 lg:h-14 xl:h-16",
              !transparent && "brightness-0"
            )}
            priority
          />
        </Link>

        <div className="hidden items-center gap-6 lg:flex xl:gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs font-semibold tracking-widest whitespace-nowrap uppercase transition-colors",
                transparent
                  ? "text-white/80 hover:text-white"
                  : "text-[#0B0B0B] hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex xl:gap-5">
          <button
            type="button"
            aria-label="Search"
            className={cn(
              "transition-colors",
              transparent
                ? "text-white/80 hover:text-white"
                : "text-[#0B0B0B] hover:text-foreground"
            )}
          >
            <Search className="size-4.5" />
          </button>

          {user ? (
            <button
              type="button"
              aria-label="Your account"
              onClick={() => setAccountOpen(true)}
            >
              <Avatar size="sm">
                <AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
                  {initials(user.fullName || user.email)}
                </AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <Link
              href="/login"
              aria-label="Account"
              className={cn(
                "transition-colors",
                transparent
                  ? "text-white/80 hover:text-white"
                  : "text-[#0B0B0B] hover:text-foreground"
              )}
            >
              <User className="size-4.5" />
            </Link>
          )}

          <Button
            variant="gradient"
            nativeButton={false}
            render={<Link href="/competitions" />}
            className="h-9 rounded-full px-6 text-xs font-bold tracking-widest uppercase"
          >
            Enter Now
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant={transparent ? "outline-transparent" : "ghost"}
                size="icon"
                className="lg:hidden"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="dark relative w-full overflow-hidden border-white/10 bg-background text-foreground sm:max-w-xs"
          >
            <AmbientBlobs />

            <div ref={menuRef} className="relative z-10 flex flex-1 flex-col">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src="/pwr-logo.svg"
                    alt="PWR"
                    width={90}
                    height={44}
                    className="h-9 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-semibold tracking-widest text-white/70 uppercase transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-2 border-t border-white/10 p-4">
                {user ? (
                  <Button
                    variant="outline-transparent"
                    onClick={() => {
                      setOpen(false);
                      setAccountOpen(true);
                    }}
                  >
                    <Avatar size="sm">
                      <AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
                        {initials(user.fullName || user.email)}
                      </AvatarFallback>
                    </Avatar>
                    My account
                  </Button>
                ) : (
                  <Button
                    variant="outline-transparent"
                    nativeButton={false}
                    render={<Link href="/login" onClick={() => setOpen(false)} />}
                  >
                    Log in
                  </Button>
                )}
                <Button
                  variant="gradient"
                  className="rounded-full"
                  nativeButton={false}
                  render={
                    <Link href="/competitions" onClick={() => setOpen(false)} />
                  }
                >
                  Enter Now
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      {user && (
        <AccountSheet
          open={accountOpen}
          onOpenChange={setAccountOpen}
          profile={user}
        />
      )}
    </header>
  );
}
