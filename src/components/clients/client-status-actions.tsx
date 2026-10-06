"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { changeClientStatus } from "@/lib/actions/clients";
import type { ClientStatus } from "@prisma/client";

const STATUSES: ClientStatus[] = ["LEAD", "PROPOSAL", "ONBOARDING", "ACTIVE", "PAUSED", "COMPLETED", "LOST", "ARCHIVED"];

export function ClientStatusActions({ clientId, status }: { clientId: string; status: ClientStatus }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function setStatus(next: ClientStatus) {
    startTransition(async () => {
      await changeClientStatus(clientId, next);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className="flex h-9 items-center gap-1.5 rounded-md border border-[var(--border-strong)] px-3 text-sm text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
      >
        Change status <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-30 w-44 rounded-md border border-[var(--border)] bg-[var(--surface)] py-1 shadow-xl">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              disabled={s === status}
              className="flex w-full items-center px-3 py-1.5 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface-hover)] disabled:opacity-40"
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
