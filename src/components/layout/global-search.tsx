"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchGroup = { label: string; items: { id: string; title: string; subtitle?: string; href: string }[] };

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<SearchGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- debounced search fetch
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((data) => setGroups(data.groups ?? []))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-2)]" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search employees, clients, tasks…"
          className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--surface-2)] pl-8 pr-8 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setGroups([]);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-2)] hover:text-[var(--foreground)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-11 z-50 max-h-96 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl">
          {loading && <p className="px-4 py-3 text-xs text-[var(--muted)]">Searching…</p>}
          {!loading && groups.length === 0 && (
            <p className="px-4 py-3 text-xs text-[var(--muted)]">No results for &ldquo;{query}&rdquo;</p>
          )}
          {!loading &&
            groups.map((group) => (
              <div key={group.label} className="border-b border-[var(--border)] last:border-0">
                <p className="px-4 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-2)]">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                      router.push(item.href);
                    }}
                    className={cn(
                      "flex w-full flex-col items-start px-4 py-2 text-left text-sm hover:bg-[var(--surface-hover)]"
                    )}
                  >
                    <span className="text-[var(--foreground)]">{item.title}</span>
                    {item.subtitle && <span className="text-xs text-[var(--muted)]">{item.subtitle}</span>}
                  </button>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
