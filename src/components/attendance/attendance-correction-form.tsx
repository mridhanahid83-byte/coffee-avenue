"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { correctAttendance, type AttendanceActionState } from "@/lib/actions/attendance";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const STATUSES = ["PRESENT", "LATE", "ABSENT", "LEAVE", "HALF_DAY", "HOLIDAY"];

export function AttendanceCorrectionForm({
  attendanceId,
  currentStatus,
  checkInTime,
  checkOutTime,
}: {
  attendanceId: string;
  currentStatus: string;
  checkInTime: string;
  checkOutTime: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<AttendanceActionState, FormData>(correctAttendance, {});
  const router = useRouter();

  if (state.success && open) {
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-[var(--muted)] hover:text-[var(--accent)]">
        <Pencil className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <div className="absolute right-0 top-8 z-30 w-72 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl">
      <form action={formAction} className="flex flex-col gap-2.5">
        <input type="hidden" name="attendanceId" value={attendanceId} />
        <Select name="status" defaultValue={currentStatus}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <div className="flex gap-2">
          <Input type="time" name="checkInTime" defaultValue={checkInTime} placeholder="Check-in" />
          <Input type="time" name="checkOutTime" defaultValue={checkOutTime} placeholder="Check-out" />
        </div>
        <Textarea name="correctionNote" placeholder="Reason for correction (required)" rows={2} required />
        {state.error && <p className="text-xs text-[var(--danger)]">{state.error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={pending}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
