"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/competitions", label: "Competitions" },
  { href: "/#winners", label: "Winners" },
  { href: "/#about", label: "About PWR" },
  { href: "/#contact", label: "Contact Us" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const transparent = pathname === "/" || pathname === "/competitions";

  return (
    <header
      className={cn(
        "z-50 w-full",
        transparent
          ? "absolute top-0 inset-x-0"
          : "sticky top-0 border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60"
      )}
    >
      <nav className="container flex h-18 items-center justify-between sm:h-20 lg:h-24">
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
                  : "text-muted-foreground hover:text-foreground"
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
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Search className="size-4.5" />
          </button>
          <Link
            href="/login"
            aria-label="Account"
            className={cn(
              "transition-colors",
              transparent
                ? "text-white/80 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="size-4.5" />
          </Link>
          <Link
            href="/dashboard/orders"
            aria-label="Basket"
            className={cn(
              "transition-colors",
              transparent
                ? "text-white/80 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ShoppingBag className="size-4.5" />
          </Link>
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
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Image
                  src="/pwr-logo.svg"
                  alt="PWR"
                  width={90}
                  height={44}
                  className="h-9 w-auto brightness-0"
                />
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/login" onClick={() => setOpen(false)} />}
                >
                  Log in
                </Button>
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
    </header>
  );
}
