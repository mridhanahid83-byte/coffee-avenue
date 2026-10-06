"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/settings", label: "General" },
  { href: "/settings/departments", label: "Departments" },
  { href: "/settings/roles", label: "Roles & Permissions" },
  { href: "/settings/leave-types", label: "Leave Types" },
  { href: "/settings/holidays", label: "Holidays" },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <div className="scrollbar-thin flex gap-1 overflow-x-auto border-b border-[var(--border)]">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
