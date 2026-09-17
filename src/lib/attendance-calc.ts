import type { WorkScheduleSettings } from "@/lib/settings";

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isWorkingDay(date: Date, schedule: WorkScheduleSettings) {
  return schedule.workingDays.includes(date.getDay());
}

export function parseTimeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Returns { status, lateMinutes } based on check-in time vs. configured start + grace period. */
export function computeCheckInStatus(checkInAt: Date, schedule: WorkScheduleSettings) {
  const startMinutes = parseTimeToMinutes(schedule.startTime);
  const checkInMinutes = checkInAt.getHours() * 60 + checkInAt.getMinutes();
  const graceMinutes = startMinutes + schedule.gracePeriodMinutes;

  if (checkInMinutes <= graceMinutes) {
    return { status: "PRESENT" as const, lateMinutes: 0 };
  }
  return { status: "LATE" as const, lateMinutes: checkInMinutes - startMinutes };
}

/** Counts configured working days between two dates (inclusive), excluding given holiday dates. */
export function countWorkingDays(start: Date, end: Date, schedule: WorkScheduleSettings, holidayDates: Set<string>) {
  let count = 0;
  const cursor = startOfDay(start);
  const last = startOfDay(end);
  while (cursor <= last) {
    const key = cursor.toISOString().slice(0, 10);
    if (isWorkingDay(cursor, schedule) && !holidayDates.has(key)) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}
