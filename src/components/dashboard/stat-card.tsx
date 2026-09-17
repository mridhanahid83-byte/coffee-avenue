import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  href,
  icon: Icon,
  tone = "neutral",
  sub,
}: {
  label: string;
  value: number | string;
  href?: string;
  icon?: LucideIcon;
  tone?: "neutral" | "success" | "warning" | "danger" | "accent";
  sub?: string;
}) {
  const toneColor: Record<string, string> = {
    neutral: "text-[var(--foreground)]",
    success: "text-[var(--success)]",
    warning: "text-[var(--warning)]",
    danger: "text-[var(--danger)]",
    accent: "text-[var(--accent)]",
  };

  const content = (
    <div
      className={cn(
        "group flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors",
        href && "hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] cursor-pointer"
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
        <p className={cn("mt-1.5 text-2xl font-semibold tabular-nums", toneColor[tone])}>{value}</p>
        {sub && <p className="mt-0.5 text-[11px] text-[var(--muted-2)]">{sub}</p>}
      </div>
      {Icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)]">
          <Icon className="h-4.5 w-4.5 text-[var(--muted)]" />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
