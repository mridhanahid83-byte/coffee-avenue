import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]/40 px-6 py-14 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-2)]">
          <Icon className="h-5 w-5 text-[var(--muted)]" />
        </div>
      )}
      <p className="text-sm font-medium text-[var(--foreground)]">{title}</p>
      {description && <p className="max-w-sm text-xs text-[var(--muted)]">{description}</p>}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-3 inline-flex h-8 items-center rounded-md bg-[var(--accent)] px-3 text-xs font-medium text-[var(--accent-foreground)] hover:opacity-90"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
