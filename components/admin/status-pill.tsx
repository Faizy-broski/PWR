import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  warm: "bg-amber-50 text-amber-700",
  dark: "bg-neutral-900 text-white",
  muted: "bg-neutral-100 text-neutral-600",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
} as const;

export function StatusPill({
  tone,
  children,
  className,
}: {
  tone: keyof typeof TONE_CLASSES;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
