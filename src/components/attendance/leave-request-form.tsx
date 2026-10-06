"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { requestLeave, type LeaveFormState } from "@/lib/actions/leave";

export function LeaveRequestForm({ leaveTypes }: { leaveTypes: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState<LeaveFormState, FormData>(requestLeave, {});
  const router = useRouter();

  useEffect(() => {
    if (state.success) router.refresh();
  }, [state.success, router]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Select name="leaveTypeId" required>
        <option value="" disabled>
          Select leave type
        </option>
        {leaveTypes.map((lt) => (
          <option key={lt.id} value={lt.id}>
            {lt.name}
          </option>
        ))}
      </Select>
      <div className="grid grid-cols-2 gap-2">
        <Input name="startDate" type="date" required />
        <Input name="endDate" type="date" required />
      </div>
      <Textarea name="reason" placeholder="Reason (optional)" rows={2} />
      {state.error && <p className="text-xs text-[var(--danger)]">{state.error}</p>}
      {state.success && <p className="text-xs text-[var(--success)]">Leave request submitted.</p>}
      <Button type="submit" size="sm" disabled={pending} className="self-end">
        {pending ? "Submitting…" : "Request leave"}
      </Button>
    </form>
  );
}
