"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { GlobalSearch } from "@/components/layout/global-search";
import { NotificationBell } from "@/components/layout/notification-bell";
import { UserMenu } from "@/components/layout/user-menu";
import type { NavItem } from "@/lib/nav";

export function AppShell({
  navItems,
  agencyName,
  today,
  user,
  children,
}: {
  navItems: NavItem[];
  agencyName: string;
  today: string;
  user: { name: string; roleName: string; email: string; photoUrl?: string | null };
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] py-5 lg:flex">
        <SidebarHeader agencyName={agencyName} />
        <div className="mt-4 flex-1 overflow-y-auto">
          <SidebarNav items={navItems} />
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] py-5">
            <div className="flex items-center justify-between px-4">
              <SidebarHeader agencyName={agencyName} />
              <button onClick={() => setMobileOpen(false)} className="text-[var(--muted)]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex-1 overflow-y-auto">
              <SidebarNav items={navItems} onNavigate={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-[var(--border)] bg-[var(--background)]/90 px-4 backdrop-blur">
          <button onClick={() => setMobileOpen(true)} className="text-[var(--muted)] lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <GlobalSearch />
          </div>
          <p className="hidden shrink-0 text-xs text-[var(--muted)] md:block">{today}</p>
          <NotificationBell />
          <UserMenu name={user.name} roleName={user.roleName} email={user.email} photoUrl={user.photoUrl} />
        </header>

        <main className="flex-1 px-4 py-5 md:px-6 md:py-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarHeader({ agencyName }: { agencyName: string }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 px-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-bold text-[var(--accent-foreground)]">
        FT
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold leading-tight text-[var(--foreground)]">{agencyName}</p>
        <p className="text-[10px] leading-tight text-[var(--muted)]">Agency OS</p>
      </div>
    </Link>
  );
}
