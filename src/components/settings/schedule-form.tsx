"use client";

import { useActionState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateScheduleSettings, type SimpleFormState } from "@/lib/actions/settings";
import type { WorkScheduleSettings } from "@/lib/settings";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export function ScheduleForm({ initial }: { initial: WorkScheduleSettings }) {
  const [state, formAction, pending] = useActionState<SimpleFormState, FormData>(updateScheduleSettings, {});

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="flex flex-col gap-5">
          <div>
            <Label htmlFor="agencyName">Agency name</Label>
            <Input id="agencyName" name="agencyName" defaultValue={initial.agencyName} required />
          </div>

          <div>
            <Label>Official working days</Label>
            <div className="flex flex-wrap gap-3">
              {DAYS.map((d) => (
                <label key={d.value} className="flex items-center gap-1.5 text-sm text-[var(--foreground)]">
                  <input
                    type="checkbox"
                    name="workingDays"
                    value={d.value}
                    defaultChecked={initial.workingDays.includes(d.value)}
                    className="h-4 w-4 rounded border-[var(--border-strong)]"
                  />
                  {d.label}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="startTime">Daily start</Label>
              <Input id="startTime" name="startTime" type="time" defaultValue={initial.startTime} />
            </div>
            <div>
              <Label htmlFor="meetingTime">Team meeting</Label>
              <Input id="meetingTime" name="meetingTime" type="time" defaultValue={initial.meetingTime} />
            </div>
            <div>
              <Label htmlFor="accountabilityTime">Final accountability</Label>
              <Input id="accountabilityTime" name="accountabilityTime" type="time" defaultValue={initial.accountabilityTime} />
            </div>
            <div>
              <Label htmlFor="endTime">End of workday</Label>
              <Input id="endTime" name="endTime" type="time" defaultValue={initial.endTime} />
            </div>
            <div>
              <Label htmlFor="gracePeriodMinutes">Grace period (minutes)</Label>
              <Input id="gracePeriodMinutes" name="gracePeriodMinutes" type="number" min={0} max={120} defaultValue={initial.gracePeriodMinutes} />
            </div>
          </div>

          {state.error && <p className="text-xs text-[var(--danger)]">{state.error}</p>}
          {state.success && <p className="text-xs text-[var(--success)]">Settings saved.</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
