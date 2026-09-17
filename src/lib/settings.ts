import { prisma } from "@/lib/prisma";

export type WorkScheduleSettings = {
  agencyName: string;
  workingDays: number[]; // 0=Sunday ... 6=Saturday
  startTime: string; // "11:00"
  meetingTime: string; // "20:00"
  accountabilityTime: string; // "00:00" (next day)
  endTime: string; // "02:00" (next day)
  gracePeriodMinutes: number;
};

export const DEFAULT_SCHEDULE: WorkScheduleSettings = {
  agencyName: "FameTerra Digital Agency",
  workingDays: [0, 1, 2, 3, 4], // Sunday - Thursday
  startTime: "11:00",
  meetingTime: "20:00",
  accountabilityTime: "00:00",
  endTime: "02:00",
  gracePeriodMinutes: 15,
};

const SCHEDULE_KEY = "work_schedule";

export async function getScheduleSettings(): Promise<WorkScheduleSettings> {
  const row = await prisma.setting.findUnique({ where: { key: SCHEDULE_KEY } });
  if (!row) return DEFAULT_SCHEDULE;
  return { ...DEFAULT_SCHEDULE, ...(row.value as Partial<WorkScheduleSettings>) };
}

export async function setScheduleSettings(value: WorkScheduleSettings) {
  return prisma.setting.upsert({
    where: { key: SCHEDULE_KEY },
    create: { key: SCHEDULE_KEY, value },
    update: { value },
  });
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await prisma.setting.findUnique({ where: { key } });
  if (!row) return fallback;
  return row.value as T;
}

export async function setSetting(key: string, value: unknown) {
  return prisma.setting.upsert({
    where: { key },
    create: { key, value: value as object },
    update: { value: value as object },
  });
}
