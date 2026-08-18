import { AlertTriangle } from "lucide-react";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen -mt-18 bg-background pt-32 text-foreground sm:-mt-20 sm:pt-36 lg:-mt-24 lg:pt-40">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>
            <strong>Draft placeholder.</strong> This page needs review by a
            qualified legal advisor before launch — it is not yet valid,
            binding copy.
          </p>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </div>
  );
}
