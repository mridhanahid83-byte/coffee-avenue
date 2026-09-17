"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionPermission } from "@/lib/auth-guard";
import { logActivity } from "@/lib/activity";
import { setScheduleSettings, type WorkScheduleSettings } from "@/lib/settings";
import { slugify } from "@/lib/seed-data";
import { ALL_PERMISSIONS } from "@/lib/permissions";

export type SimpleFormState = { error?: string; success?: boolean };

const scheduleSchema = z.object({
  agencyName: z.string().min(1),
  workingDays: z.array(z.coerce.number().min(0).max(6)),
  startTime: z.string(),
  meetingTime: z.string(),
  accountabilityTime: z.string(),
  endTime: z.string(),
  gracePeriodMinutes: z.coerce.number().min(0).max(120),
});

export async function updateScheduleSettings(_prev: SimpleFormState, formData: FormData): Promise<SimpleFormState> {
  const session = await requireActionPermission("settings.manage");

  const parsed = scheduleSchema.safeParse({
    agencyName: formData.get("agencyName"),
    workingDays: formData.getAll("workingDays"),
    startTime: formData.get("startTime"),
    meetingTime: formData.get("meetingTime"),
    accountabilityTime: formData.get("accountabilityTime"),
    endTime: formData.get("endTime"),
    gracePeriodMinutes: formData.get("gracePeriodMinutes"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  await setScheduleSettings(parsed.data as WorkScheduleSettings);

  await logActivity({
    actorId: session.user.id,
    action: "SETTINGS_UPDATED",
    entityType: "System",
    description: `${session.user.name} updated working schedule settings`,
  });

  revalidatePath("/settings");
  return { success: true };
}

// ── Departments ─────────────────────────────────────────────────────────

export async function createDepartment(_prev: SimpleFormState, formData: FormData): Promise<SimpleFormState> {
  const session = await requireActionPermission("org.manage");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Department name is required." };

  const slug = slugify(name);
  const existing = await prisma.department.findUnique({ where: { slug } });
  if (existing) return { error: "A department with this name already exists." };

  await prisma.department.create({ data: { name, slug } });
  await logActivity({ actorId: session.user.id, action: "DEPARTMENT_CREATED", entityType: "Department", description: `${session.user.name} created department "${name}"` });

  revalidatePath("/settings/departments");
  return { success: true };
}

export async function deleteDepartment(id: string): Promise<SimpleFormState> {
  const session = await requireActionPermission("org.manage");
  const dept = await prisma.department.findUnique({ where: { id }, include: { _count: { select: { employees: true, tasks: true } } } });
  if (!dept) return { error: "Department not found." };
  if (dept.isSystem) return { error: "Default departments cannot be deleted." };
  if (dept._count.employees > 0 || dept._count.tasks > 0) {
    return { error: "This department is in use and cannot be deleted." };
  }

  await prisma.department.delete({ where: { id } });
  await logActivity({ actorId: session.user.id, action: "DEPARTMENT_DELETED", entityType: "Department", description: `${session.user.name} deleted department "${dept.name}"` });

  revalidatePath("/settings/departments");
  return { success: true };
}

// ── Roles & permissions ─────────────────────────────────────────────────

export async function createRole(_prev: SimpleFormState, formData: FormData): Promise<SimpleFormState> {
  const session = await requireActionPermission("org.manage");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Role name is required." };

  const slug = slugify(name);
  const existing = await prisma.role.findUnique({ where: { slug } });
  if (existing) return { error: "A role with this name already exists." };

  await prisma.role.create({ data: { name, slug, permissions: [] } });
  await logActivity({ actorId: session.user.id, action: "ROLE_CREATED", entityType: "Role", description: `${session.user.name} created role "${name}"` });

  revalidatePath("/settings/roles");
  return { success: true };
}

export async function updateRolePermissions(roleId: string, permissions: string[]): Promise<SimpleFormState> {
  const session = await requireActionPermission("org.manage");
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) return { error: "Role not found." };

  const valid = permissions.filter((p) => p === "*" || ALL_PERMISSIONS.includes(p));

  await prisma.role.update({ where: { id: roleId }, data: { permissions: valid } });
  await logActivity({ actorId: session.user.id, action: "ROLE_PERMISSIONS_UPDATED", entityType: "Role", entityId: roleId, description: `${session.user.name} updated permissions for role "${role.name}"` });

  revalidatePath("/settings/roles");
  return { success: true };
}

export async function deleteRole(id: string): Promise<SimpleFormState> {
  const session = await requireActionPermission("org.manage");
  const role = await prisma.role.findUnique({ where: { id }, include: { _count: { select: { employees: true } } } });
  if (!role) return { error: "Role not found." };
  if (role.isSystem) return { error: "Default roles cannot be deleted." };
  if (role._count.employees > 0) return { error: "This role is in use and cannot be deleted." };

  await prisma.role.delete({ where: { id } });
  await logActivity({ actorId: session.user.id, action: "ROLE_DELETED", entityType: "Role", description: `${session.user.name} deleted role "${role.name}"` });

  revalidatePath("/settings/roles");
  return { success: true };
}

// ── Leave types ──────────────────────────────────────────────────────────

export async function createLeaveType(_prev: SimpleFormState, formData: FormData): Promise<SimpleFormState> {
  const session = await requireActionPermission("leave.manageTypes");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Leave type name is required." };
  const isPaid = formData.get("isPaid") === "true";

  const existing = await prisma.leaveType.findUnique({ where: { name } });
  if (existing) return { error: "This leave type already exists." };

  await prisma.leaveType.create({ data: { name, isPaid } });
  await logActivity({ actorId: session.user.id, action: "LEAVE_TYPE_CREATED", entityType: "LeaveType", description: `${session.user.name} created leave type "${name}"` });

  revalidatePath("/settings/leave-types");
  return { success: true };
}

export async function toggleLeaveTypeActive(id: string, active: boolean): Promise<SimpleFormState> {
  const session = await requireActionPermission("leave.manageTypes");
  const lt = await prisma.leaveType.update({ where: { id }, data: { active } });
  await logActivity({ actorId: session.user.id, action: "LEAVE_TYPE_UPDATED", entityType: "LeaveType", entityId: id, description: `${session.user.name} ${active ? "enabled" : "disabled"} leave type "${lt.name}"` });
  revalidatePath("/settings/leave-types");
  return { success: true };
}

// ── Holidays ────────────────────────────────────────────────────────────

export async function createHoliday(_prev: SimpleFormState, formData: FormData): Promise<SimpleFormState> {
  const session = await requireActionPermission("leave.manageTypes");
  const name = String(formData.get("name") ?? "").trim();
  const dateStr = String(formData.get("date") ?? "");
  if (!name || !dateStr) return { error: "Name and date are required." };

  const date = new Date(dateStr);
  const existing = await prisma.holiday.findUnique({ where: { date } });
  if (existing) return { error: "A holiday already exists on this date." };

  await prisma.holiday.create({ data: { name, date } });
  await logActivity({ actorId: session.user.id, action: "HOLIDAY_CREATED", entityType: "Holiday", description: `${session.user.name} added holiday "${name}"` });

  revalidatePath("/settings/holidays");
  return { success: true };
}

export async function deleteHoliday(id: string): Promise<SimpleFormState> {
  const session = await requireActionPermission("leave.manageTypes");
  const holiday = await prisma.holiday.delete({ where: { id } });
  await logActivity({ actorId: session.user.id, action: "HOLIDAY_DELETED", entityType: "Holiday", description: `${session.user.name} removed holiday "${holiday.name}"` });
  revalidatePath("/settings/holidays");
  return { success: true };
}
