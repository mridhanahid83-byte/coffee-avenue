"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { checkIn, checkOut } from "@/lib/actions/attendance";
import { formatTime } from "@/lib/utils";
import { LogIn, LogOut } from "lucide-react";

export function CheckInCard({
  record,
  schedule,
}: {
  record: { checkInAt: string | null; checkOutAt: string | null; status: string } | null;
  schedule: { startTime: string; endTime: string };
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  function handleCheckIn() {
    startTransition(async () => {
      const res = await checkIn();
      if (res.error) setError(res.error);
      else {
        setError(null);
        router.refresh();
      }
    });
  }

  function handleCheckOut() {
    startTransition(async () => {
      const res = await checkOut();
      if (res.error) setError(res.error);
      else {
        setError(null);
        router.refresh();
      }
    });
  }

  const hasCheckedIn = !!record?.checkInAt;
  const hasCheckedOut = !!record?.checkOutAt;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 pt-6 pb-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-xs text-[var(--muted)]">Today&apos;s attendance</p>
          {!hasCheckedIn && <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">Not checked in yet</p>}
          {hasCheckedIn && !hasCheckedOut && (
            <div className="mt-1 flex items-center gap-2">
              <p className="text-lg font-semibold text-[var(--foreground)]">Checked in at {formatTime(record?.checkInAt)}</p>
              {record?.status && <StatusBadge type="attendanceStatus" value={record.status} />}
            </div>
          )}
          {hasCheckedIn && hasCheckedOut && (
            <div className="mt-1 flex items-center gap-2">
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {formatTime(record?.checkInAt)} → {formatTime(record?.checkOutAt)}
              </p>
              {record?.status && <StatusBadge type="attendanceStatus" value={record.status} />}
            </div>
          )}
          <p className="mt-1 text-xs text-[var(--muted-2)]">
            Working hours: {schedule.startTime} – {schedule.endTime} (next day)
          </p>
          {error && <p className="mt-2 text-xs text-[var(--danger)]">{error}</p>}
        </div>

        {!hasCheckedIn && (
          <Button onClick={handleCheckIn} disabled={pending} size="lg">
            <LogIn className="h-4 w-4" /> Check In
          </Button>
        )}
        {hasCheckedIn && !hasCheckedOut && (
          <Button onClick={handleCheckOut} disabled={pending} size="lg" variant="secondary">
            <LogOut className="h-4 w-4" /> Check Out
          </Button>
        )}
        {hasCheckedIn && hasCheckedOut && (
          <p className="rounded-md bg-[var(--success-soft)] px-3 py-1.5 text-sm font-medium text-[var(--success)]">Day complete</p>
        )}
      </CardContent>
    </Card>
  );
}
