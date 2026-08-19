"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

// A real (not decorative) quick-jump: filters the admin's own competition
// list client-side and navigates straight to the matching competition's
// edit page — no fake search results, no backend endpoint to build for a
// dataset this small.
export function AdminQuickSearch({
  competitions,
}: {
  competitions: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return competitions
      .filter((c) => c.title.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, competitions]);

  function go(id: string) {
    setQuery("");
    setFocused(false);
    router.push(`/admin/competitions/${id}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-56 shrink">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && matches[0]) go(matches[0].id);
        }}
        placeholder="Search"
        className="h-9 w-full rounded-full border border-border bg-muted/40 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-background"
      />

      {focused && matches.length > 0 && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          {matches.map((c) => (
            <button
              key={c.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => go(c.id)}
              className="block w-full truncate px-3 py-2 text-left text-sm hover:bg-accent"
            >
              {c.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
