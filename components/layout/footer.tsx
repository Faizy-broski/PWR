import Link from "next/link";
import { Trophy } from "lucide-react";

const columns = [
  {
    title: "Competitions",
    links: [
      { href: "/competitions", label: "Live Competitions" },
      { href: "/competitions?status=closed", label: "Past Winners" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/dashboard", label: "My Entries" },
      { href: "/dashboard/orders", label: "Order History" },
      { href: "/login", label: "Log in" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/free-entry", label: "Free Postal Entry" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <Trophy className="size-5" />
            <span>PWR</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            UK prize competitions. Every entry gets a real chance to win.
            18+ only. BeGambleAware.org.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border/60 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} PWR Competitions Ltd. All rights reserved.
      </div>
    </footer>
  );
}
