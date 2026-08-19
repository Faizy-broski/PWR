import type { TransactionStatus } from "@/lib/types";

export const ENTRY_STATUS_STYLE: Record<
  TransactionStatus,
  { label: string; tone: "green" | "muted" | "red" }
> = {
  paid: { label: "Completed", tone: "green" },
  pending: { label: "Pending", tone: "muted" },
  failed: { label: "Failed", tone: "red" },
  refunded: { label: "Refunded", tone: "muted" },
};
