"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { adminNavLinks } from "@/components/admin/nav-links";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="dark lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72">
      <div className="flex flex-col bg-background text-foreground lg:h-full lg:overflow-hidden lg:rounded-br-4xl lg:shadow-xl">
        <div className="hidden items-center gap-2 p-5 lg:flex">
          <Image
            src="/pwr-logo.svg"
            alt="PWR"
            width={90}
            height={44}
            className="h-12 w-auto"
          />
        </div>

        <nav className="flex gap-1 overflow-x-auto p-2 lg:flex-1 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-3 lg:pt-2 lg:pb-3">
          {adminNavLinks.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex shrink-0 items-center gap-3 rounded-full py-2 pr-4 pl-2 text-sm font-medium transition-colors",
                  active
                    ? "text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="admin-nav-active"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 rounded-full bg-linear-to-b from-white/10 to-white/0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] border-[#AD7B3D] border-l-3"
                    
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
                    active
                      ? "text-brand-gold-light"
                      : "text-white/50",
                  )}
                >
                  <link.icon className="size-4" />
                </span>
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
