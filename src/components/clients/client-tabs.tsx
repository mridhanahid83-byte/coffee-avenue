import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "team", label: "Team" },
  { key: "tasks", label: "Tasks" },
  { key: "content", label: "Content" },
  { key: "campaigns", label: "Campaigns" },
  { key: "deadlines", label: "Deadlines" },
  { key: "performance", label: "Performance" },
  { key: "notes", label: "Notes" },
  { key: "activity", label: "Activity" },
];

export function ClientTabs({ clientId, active }: { clientId: string; active: string }) {
  return (
    <div className="scrollbar-thin flex gap-1 overflow-x-auto border-b border-[var(--border)]">
      {TABS.map((t) => (
        <Link
          key={t.key}
          href={`/clients/${clientId}?tab=${t.key}`}
          className={cn(
            "shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
            active === t.key
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
