"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionPermission } from "@/lib/auth-guard";
import { logActivity } from "@/lib/activity";
import { notify } from "@/lib/notifications";
import { startOfDay } from "@/lib/attendance-calc";

export type LeaveFormState = { error?: string; success?: boolean };

const requestSchema = z.object({
  leaveTypeId: z.string().min(1, "Leave type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().optional(),
});

export async function requestLeave(_prev: LeaveFormState, formData: FormData): Promise<LeaveFormState> {
  const session = await requireActionPermission("leave.request");
  const parsed = requestSchema.safeParse({
    leaveTypeId: formData.get("leaveTypeId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    reason: formData.get("reason") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  const start = new Date(d.startDate);
  const end = new Date(d.endDate);
  if (end < start) return { error: "End date cannot be before start date." };

  const leave = await prisma.leave.create({
    data: { employeeId: session.user.id, leaveTypeId: d.leaveTypeId, startDate: start, endDate: end, reason: d.reason },
  });

  await logActivity({
    actorId: session.user.id,
    action: "LEAVE_REQUESTED",
    entityType: "Leave",
    entityId: leave.id,
    description: `${session.user.name} requested leave from ${d.startDate} to ${d.endDate}`,
  });

  const activeEmployees = await prisma.employee.findMany({ where: { status: "ACTIVE" }, include: { role: true } });
  const reviewers = activeEmployees.filter((e) => {
    const perms = e.role.permissions as string[];
    return perms.includes("*") || perms.includes("leave.review");
  });
  for (const r of reviewers) {
    await notify({
      employeeId: r.id,
      type: "LEAVE_STATUS",
      title: "New leave request",
      message: `${session.user.name} requested leave from ${d.startDate} to ${d.endDate}`,
      link: "/attendance",
    });
  }

  revalidatePath("/attendance");
  return { success: true };
}

export async function reviewLeave(leaveId: string, decision: "APPROVED" | "REJECTED", note?: string) {
  const session = await requireActionPermission("leave.review");
  const leave = await prisma.leave.findUnique({ where: { id: leaveId }, include: { employee: true } });
  if (!leave) return { error: "Leave request not found." };
  if (leave.status !== "PENDING") return { error: "This request has already been reviewed." };

  await prisma.leave.update({
    where: { id: leaveId },
    data: { status: decision, reviewedById: session.user.id, reviewedAt: new Date(), reviewNote: note },
  });

  if (decision === "APPROVED") {
    const cursor = startOfDay(leave.startDate);
    const last = startOfDay(leave.endDate);
    while (cursor <= last) {
      const date = new Date(cursor);
      await prisma.attendance.upsert({
        where: { employeeId_date: { employeeId: leave.employeeId, date } },
        create: { employeeId: leave.employeeId, date, status: "LEAVE" },
        update: { status: "LEAVE" },
      });
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  await logActivity({
    actorId: session.user.id,
    action: "LEAVE_REVIEWED",
    entityType: "Leave",
    entityId: leaveId,
    description: `${session.user.name} ${decision === "APPROVED" ? "approved" : "rejected"} ${leave.employee.fullName}'s leave request`,
  });

  await notify({
    employeeId: leave.employeeId,
    type: "LEAVE_STATUS",
    title: `Leave request ${decision === "APPROVED" ? "approved" : "rejected"}`,
    message: `${session.user.name} ${decision === "APPROVED" ? "approved" : "rejected"} your leave request${note ? `: ${note}` : ""}`,
    link: "/attendance",
  });

  revalidatePath("/attendance");
  return { ok: true };
}
