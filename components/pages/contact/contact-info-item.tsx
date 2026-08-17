import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactInfoItemData {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

export function ContactInfoItem({
  item,
  className,
}: {
  item: ContactInfoItemData;
  className?: string;
}) {
  const { icon: Icon, label, value, href } = item;

  const content = (
    <>
      <p className="text-[10px] font-semibold tracking-[0.15em] text-white/40 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm text-white">{value}</p>
    </>
  );

  return (
    <div
      className={cn(
        "flex items-start gap-3 border-b border-white/10 pb-5",
        className
      )}
    >
      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-brand-gold-light">
        <Icon className="size-4" strokeWidth={1.75} />
      </span>
      <div>
        {href ? (
          <a href={href} className="transition-colors hover:text-brand-gold-light">
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    </div>
  );
}