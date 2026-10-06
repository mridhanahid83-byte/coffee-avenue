"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createVoiceChannel, type VoiceFormState } from "@/lib/actions/voice";
import { Plus } from "lucide-react";

type EmployeeOption = { id: string; fullName: string };

export function VoiceChannelForm({ employees }: { employees: EmployeeOption[] }) {
  const [open, setOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [members, setMembers] = useState<string[]>([]);
  const [state, formAction, pending] = useActionState<VoiceFormState, FormData>(createVoiceChannel, {});
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hide the form after a successful submission
      setOpen(false);
      router.refresh();
    }
  }, [state.success, router]);

  function toggleMember(id: string) {
    setMembers((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> New Voice Channel
      </Button>
    );
  }

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <Input name="name" placeholder="Channel name (e.g. Daily Standup)" required />
      <Input name="description" placeholder="Description (optional)" />

      <label className="mt-1 flex items-center gap-2 text-sm text-[var(--foreground)]">
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          className="h-4 w-4 rounded border-[var(--border-strong)]"
        />
        Private — only invited teammates can join
      </label>
      <input type="hidden" name="isPrivate" value={isPrivate ? "true" : "false"} />

      {isPrivate && (
        <div className="scrollbar-thin mt-1 max-h-40 overflow-y-auto rounded-md border border-[var(--border)] p-2">
          <p className="mb-1 text-xs text-[var(--muted)]">Add members</p>
          {employees.map((e) => (
            <label key={e.id} className="flex items-center gap-2 py-1 text-sm text-[var(--foreground)]">
              <input
                type="checkbox"
                name="memberIds"
                value={e.id}
                checked={members.includes(e.id)}
                onChange={() => toggleMember(e.id)}
                className="h-3.5 w-3.5 rounded border-[var(--border-strong)]"
              />
              {e.fullName}
            </label>
          ))}
        </div>
      )}

      <div className="mt-1 flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "Creating…" : "Create"}
        </Button>
      </div>
      {state.error && <p className="text-xs text-[var(--danger)]">{state.error}</p>}
    </form>
  );
}
