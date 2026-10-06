"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createLeaveType, toggleLeaveTypeActive, type SimpleFormState } from "@/lib/actions/settings";

type LeaveType = { id: string; name: string; isPaid: boolean; active: boolean };

export function LeaveTypeManager({ leaveTypes }: { leaveTypes: LeaveType[] }) {
  const [state, formAction, pending] = useActionState<SimpleFormState, FormData>(createLeaveType, {});
  const [, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {leaveTypes.map((lt) => (
          <li key={lt.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-[var(--foreground)]">{lt.name}</p>
              <Badge variant={lt.isPaid ? "success" : "neutral"}>{lt.isPaid ? "Paid" : "Unpaid"}</Badge>
              {!lt.active && <Badge variant="danger">Disabled</Badge>}
            </div>
            <button
              onClick={() =>
                startTransition(async () => {
                  await toggleLeaveTypeActive(lt.id, !lt.active);
                  router.refresh();
                })
              }
              className="text-xs text-[var(--accent)] hover:underline"
            >
              {lt.active ? "Disable" : "Enable"}
            </button>
          </li>
        ))}
      </ul>

      <form action={formAction} className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
        <Input name="name" placeholder="New leave type" required className="flex-1" />
        <label className="flex items-center gap-1.5 text-sm text-[var(--foreground)]">
          <input type="checkbox" name="isPaid" value="true" defaultChecked className="h-4 w-4 rounded border-[var(--border-strong)]" />
          Paid
        </label>
        <Button type="submit" disabled={pending} size="sm">
          Add
        </Button>
      </form>
      {state.error && <p className="text-xs text-[var(--danger)]">{state.error}</p>}
    </div>
  );
}
