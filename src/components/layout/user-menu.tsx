"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, User, KeyRound } from "lucide-react";
import { initials } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/logout";

export function UserMenu({
  name,
  roleName,
  email,
  photoUrl,
}: {
  name: string;
  roleName: string;
  email: string;
  photoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-[var(--surface-hover)]">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={name} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
            {initials(name)}
          </div>
        )}
        <div className="hidden text-left sm:block">
          <p className="text-xs font-medium leading-tight text-[var(--foreground)]">{name}</p>
          <p className="text-[10px] leading-tight text-[var(--muted)]">{roleName}</p>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-56 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl">
          <div className="border-b border-[var(--border)] px-3.5 py-3">
            <p className="text-sm font-medium text-[var(--foreground)]">{name}</p>
            <p className="text-xs text-[var(--muted)]">{email}</p>
          </div>
          <div className="p-1.5">
            <Link
              href="/settings/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            >
              <User className="h-3.5 w-3.5" /> My profile
            </Link>
            <Link
              href="/settings/profile#password"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            >
              <KeyRound className="h-3.5 w-3.5" /> Change password
            </Link>
          </div>
          <div className="border-t border-[var(--border)] p-1.5">
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-[var(--danger)] hover:bg-[var(--danger-soft)]"
              >
                <LogOut className="h-3.5 w-3.5" /> Log out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
