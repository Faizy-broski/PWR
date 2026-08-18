import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TierPillData {
  id: string;
  label: string;
  description: string;
  icon: string;
  status: "live" | "comingSoon";
}

export function TierPillCard({ tier }: { tier: TierPillData }) {
  const { icon, label, description, status, id } = tier;
  const isLive = status === "live";

  return (
    <Link
      href={`#${id}`}
      className={cn(
        "flex flex-col items-center gap-2.5 rounded-2xl border p-4 text-center transition-colors sm:p-5",
        isLive
          ? "border-white/10 bg-white/[0.03] hover:border-brand-gold-dark/40"
          : "border-white/5 bg-white/[0.02] opacity-70 hover:opacity-100"
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center")}
      >
        <img
          src={icon}
          alt=""
          className={cn("size-8.5")}
        />
      </span>

      <div>
        <p className="text-lg font-extrabold tracking-wide text-white uppercase">
          {label}
        </p>
        <p className="mt-0.5 text-[10px] text-white/35">{description}</p>
      </div>

      <span
        className={cn(
          "mt-1 flex h-10 w-[50%] items-center justify-center rounded-full text-[10px] font-bold tracking-widest uppercase",
          isLive
            ? "bg-brand-gradient text-white"
            : "bg-white/5 text-white/30"
        )}
      >
        {isLive ? "See Comps" : "Coming Soon"}
      </span>
    </Link>
  );
}