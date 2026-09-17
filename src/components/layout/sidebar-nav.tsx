"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  ListChecks,
  Building2,
  FileStack,
  Megaphone,
  Users2,
  BarChart3,
  FileBarChart,
  Bell,
  History,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem, NavIconName } from "@/lib/nav";

const ICONS: Record<NavIconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  attendance: Clock,
  tasks: ListChecks,
  clients: Building2,
  content: FileStack,
  campaigns: Megaphone,
  team: Users2,
  performance: BarChart3,
  reports: FileBarChart,
  notifications: Bell,
  activity: History,
  settings: Settings,
};

export function SidebarNav({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = ICONS[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
