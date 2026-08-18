import { Button } from "@/components/ui/button";

export function ComingSoonBanner({
  title = "Coming Soon",
  description = "Exciting high-value competitions on the way, stay tuned.",
  notifyLabel = "Get Notified",
  onNotify,
}: {
  title?: string;
  description?: string;
  notifyLabel?: string;
  onNotify?: () => void;
}) {
  return (
    <div className="mt-5 flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center">
          <img src="/svg's/lock.svg" className="size-11" />
        </span>
        <div>
          <h3 className="text-xl font-extrabold text-white uppercase">
            {title}
          </h3>
          <p className="mt-1 max-w-[30ch] text-xs leading-relaxed text-white/40">
            {description}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onNotify}
        className="h-10 w-full shrink-0 rounded-full bg-white text-xs px-8 font-bold tracking-widest text-black uppercase cursor-pointer sm:w-auto"
      >
        {notifyLabel}
      </Button>
    </div>
  );
}