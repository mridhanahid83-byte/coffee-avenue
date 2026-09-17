"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionPermission } from "@/lib/auth-guard";
import { logActivity } from "@/lib/activity";
import { getScheduleSettings } from "@/lib/settings";
import { startOfDay, computeCheckInStatus } from "@/lib/attendance-calc";

export type AttendanceActionState = { error?: string; success?: boolean };

export async function checkIn(): Promise<AttendanceActionState> {
  const session = await requireActionPermission("attendance.own");
  const schedule = await getScheduleSettings();
  const now = new Date();
  const today = startOfDay(now);

  const existing = await prisma.attendance.findUnique({
    where: { employeeId_date: { employeeId: session.user.id, date: today } },
  });
  if (existing?.checkInAt) {
    return { error: "You have already checked in today." };
  }

  const { status, lateMinutes } = computeCheckInStatus(now, schedule);

  await prisma.attendance.upsert({
    where: { employeeId_date: { employeeId: session.user.id, date: today } },
    create: {
      employeeId: session.user.id,
      date: today,
      checkInAt: now,
      status,
      lateMinutes,
    },
    update: {
      checkInAt: now,
      status,
      lateMinutes,
    },
  });

  await logActivity({
    actorId: session.user.id,
    action: "ATTENDANCE_CHECK_IN",
    entityType: "Attendance",
    description: `${session.user.name} checked in`,
  });

  revalidatePath("/attendance");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function checkOut(): Promise<AttendanceActionState> {
  const session = await requireActionPermission("attendance.own");
  const now = new Date();
  const today = startOfDay(now);

  const existing = await prisma.attendance.findUnique({
    where: { employeeId_date: { employeeId: session.user.id, date: today } },
  });

  if (!existing?.checkInAt) {
    return { error: "You need to check in before you can check out." };
  }
  if (existing.checkOutAt) {
    return { error: "You have already checked out today." };
  }

  const workingMinutes = Math.round((now.getTime() - existing.checkInAt.getTime()) / 60000);

  await prisma.attendance.update({
    where: { id: existing.id },
    data: { checkOutAt: now, workingMinutes },
  });

  await logActivity({
    actorId: session.user.id,
    action: "ATTENDANCE_CHECK_OUT",
    entityType: "Attendance",
    description: `${session.user.name} checked out`,
  });

  revalidatePath("/attendance");
  revalidatePath("/dashboard");
  return { success: true };
}

const correctionSchema = z.object({
  attendanceId: z.string().min(1),
  status: z.enum(["PRESENT", "LATE", "ABSENT", "LEAVE", "HALF_DAY", "HOLIDAY"]),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  correctionNote: z.string().min(1, "A correction note is required"),
});

export async function correctAttendance(_prev: AttendanceActionState, formData: FormData): Promise<AttendanceActionState> {
  const session = await requireActionPermission("attendance.correct");

  const parsed = correctionSchema.safeParse({
    attendanceId: formData.get("attendanceId"),
    status: formData.get("status"),
    checkInTime: formData.get("checkInTime") || undefined,
    checkOutTime: formData.get("checkOutTime") || undefined,
    correctionNote: formData.get("correctionNote"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  const record = await prisma.attendance.findUnique({ where: { id: d.attendanceId } });
  if (!record) return { error: "Attendance record not found." };

  const buildTime = (time?: string) => {
    if (!time) return undefined;
    const [h, m] = time.split(":").map(Number);
    const dt = new Date(record.date);
    dt.setHours(h, m, 0, 0);
    return dt;
  };

  const checkInAt = d.checkInTime ? buildTime(d.checkInTime) : record.checkInAt;
  const checkOutAt = d.checkOutTime ? buildTime(d.checkOutTime) : record.checkOutAt;
  const workingMinutes =
    checkInAt && checkOutAt ? Math.round((checkOutAt.getTime() - checkInAt.getTime()) / 60000) : null;

  await prisma.attendance.update({
    where: { id: d.attendanceId },
    data: {
      status: d.status,
      checkInAt: checkInAt ?? null,
      checkOutAt: checkOutAt ?? null,
      workingMinutes,
      flaggedMissingCheckout: false,
      correctedById: session.user.id,
      correctionNote: d.correctionNote,
    },
  });

  await logActivity({
    actorId: session.user.id,
    action: "ATTENDANCE_CORRECTED",
    entityType: "Attendance",
    entityId: d.attendanceId,
    description: `${session.user.name} corrected an attendance record: ${d.correctionNote}`,
  });

  revalidatePath("/attendance");
  return { success: true };
}
