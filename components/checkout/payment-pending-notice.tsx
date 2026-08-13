"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const MAX_ATTEMPTS = 6;
const INTERVAL_MS = 2000;

// Stripe's webhook usually allocates tickets within a second or two of the
// browser landing back here, so poll a few times via router.refresh() (which
// re-runs the server component and re-checks the session) before giving up.
export function PaymentPendingNotice() {
  const router = useRouter();
  const attempts = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      attempts.current += 1;
      if (attempts.current > MAX_ATTEMPTS) {
        clearInterval(interval);
        return;
      }
      router.refresh();
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="mb-8 flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <Loader2 className="mt-0.5 size-5 shrink-0 animate-spin text-muted-foreground" />
      <div>
        <p className="font-medium">Confirming your payment…</p>
        <p className="text-sm text-muted-foreground">
          This usually takes a few seconds. Your tickets will appear here
          automatically.
        </p>
      </div>
    </div>
  );
}
