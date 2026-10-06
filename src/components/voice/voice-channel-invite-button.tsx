"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inviteToVoiceChannel } from "@/lib/actions/voice";

type EmployeeOption = { id: string; fullName: string };

export function VoiceChannelInviteButton({
  channelId,
  employees,
}: {
  channelId: string;
  employees: EmployeeOption[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function send() {
    if (selected.length === 0) {
      setError("Pick at least one teammate.");
      return;
    }
    startTransition(async () => {
      const res = await inviteToVoiceChannel(channelId, selected);
      if (res.error) {
        setError(res.error);
      } else {
        setSent(true);
        setSelected([]);
        router.refresh();
        setTimeout(() => {
          setSent(false);
          setOpen(false);
        }, 1200);
      }
    });
  }

  return (
    <div ref={containerRef} className="relative" onClick={(e) => e.stopPropagation()}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
          setError(null);
        }}
      >
        <UserPlus className="h-3.5 w-3.5" /> Invite
      </Button>

      {open && (
        <div className="absolute right-0 top-9 z-30 w-64 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl">
          <p className="mb-2 text-xs font-medium text-[var(--muted)]">Invite teammates to join now</p>
          {sent ? (
            <p className="py-4 text-center text-sm text-[var(--success)]">Invites sent.</p>
          ) : (
            <>
              <div className="scrollbar-thin max-h-48 overflow-y-auto">
                {employees.length === 0 && <p className="text-xs text-[var(--muted)]">No other employees to invite.</p>}
                {employees.map((e) => (
                  <label key={e.id} className="flex items-center gap-2 rounded px-1 py-1.5 text-sm text-[var(--foreground)] hover:bg-[var(--surface-hover)]">
                    <input
                      type="checkbox"
                      checked={selected.includes(e.id)}
                      onChange={() => toggle(e.id)}
                      className="h-3.5 w-3.5 rounded border-[var(--border-strong)]"
                    />
                    {e.fullName}
                  </label>
                ))}
              </div>
              {error && <p className="mt-2 text-xs text-[var(--danger)]">{error}</p>}
              <div className="mt-2 flex justify-end gap-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" size="sm" disabled={pending} onClick={send}>
                  {pending ? "Sending…" : "Send invites"}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
