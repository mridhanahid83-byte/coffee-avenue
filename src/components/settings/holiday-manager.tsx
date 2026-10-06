"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createHoliday, deleteHoliday, type SimpleFormState } from "@/lib/actions/settings";
import { formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";

type Holiday = { id: string; name: string; date: string };

export function HolidayManager({ holidays }: { holidays: Holiday[] }) {
  const [state, formAction, pending] = useActionState<SimpleFormState, FormData>(createHoliday, {});
  const [, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {holidays.map((h) => (
          <li key={h.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">{h.name}</p>
              <p className="text-xs text-[var(--muted)]">{formatDate(h.date)}</p>
            </div>
            <button
              onClick={() =>
                startTransition(async () => {
                  await deleteHoliday(h.id);
                  router.refresh();
                })
              }
              className="text-[var(--muted)] hover:text-[var(--danger)]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {holidays.length === 0 && <p className="text-sm text-[var(--muted)]">No holidays configured yet.</p>}
      </ul>

      <form action={formAction} className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
        <Input name="name" placeholder="Holiday name" required className="flex-1" />
        <Input name="date" type="date" required />
        <Button type="submit" disabled={pending} size="sm">
          Add
        </Button>
      </form>
      {state.error && <p className="text-xs text-[var(--danger)]">{state.error}</p>}
    </div>
  );
}
