"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionPermission } from "@/lib/auth-guard";
import { logActivity } from "@/lib/activity";

function randomTempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out + "!1";
}

const employeeSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  roleId: z.string().min(1, "Role is required"),
  departmentId: z.string().optional(),
  employeeType: z.enum(["FULL_TIME", "PART_TIME", "INTERN", "FREELANCER", "OTHER"]),
  joiningDate: z.string().optional(),
  managerId: z.string().optional(),
  teamLeadId: z.string().optional(),
  notes: z.string().optional(),
});

export type EmployeeFormState = { error?: string; success?: boolean; tempPassword?: string; employeeId?: string };

export async function createEmployee(_prev: EmployeeFormState, formData: FormData): Promise<EmployeeFormState> {
  const session = await requireActionPermission("employees.create");

  const parsed = employeeSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    roleId: formData.get("roleId"),
    departmentId: formData.get("departmentId") || undefined,
    employeeType: formData.get("employeeType"),
    joiningDate: formData.get("joiningDate") || undefined,
    managerId: formData.get("managerId") || undefined,
    teamLeadId: formData.get("teamLeadId") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;
  const existing = await prisma.employee.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) {
    return { error: "An employee with this email already exists." };
  }

  const tempPassword = randomTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  try {
    const employee = await prisma.employee.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        roleId: data.roleId,
        departmentId: data.departmentId || null,
        employeeType: data.employeeType,
        joiningDate: data.joiningDate ? new Date(data.joiningDate) : null,
        managerId: data.managerId || null,
        teamLeadId: data.teamLeadId || null,
        notes: data.notes,
        passwordHash,
        mustChangePassword: true,
        status: "ACTIVE",
      },
    });

    await logActivity({
      actorId: session.user.id,
      action: "EMPLOYEE_CREATED",
      entityType: "Employee",
      entityId: employee.id,
      description: `${session.user.name} added ${employee.fullName} to the team`,
    });

    revalidatePath("/team");
    return { success: true, tempPassword, employeeId: employee.id };
  } catch {
    return { error: "Unable to save employee. Please try again." };
  }
}

const employeeUpdateSchema = employeeSchema.extend({
  id: z.string().min(1),
});

export async function updateEmployee(_prev: EmployeeFormState, formData: FormData): Promise<EmployeeFormState> {
  const session = await requireActionPermission("employees.edit");

  const parsed = employeeUpdateSchema.safeParse({
    id: formData.get("id"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    roleId: formData.get("roleId"),
    departmentId: formData.get("departmentId") || undefined,
    employeeType: formData.get("employeeType"),
    joiningDate: formData.get("joiningDate") || undefined,
    managerId: formData.get("managerId") || undefined,
    teamLeadId: formData.get("teamLeadId") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  const canChangeRole = session.user.permissions.includes("*") || session.user.permissions.includes("employees.changeRole");

  try {
    const current = await prisma.employee.findUnique({ where: { id: data.id } });
    if (!current) return { error: "Employee not found." };

    if (data.managerId === data.id || data.teamLeadId === data.id) {
      return { error: "An employee cannot be their own manager or team lead." };
    }

    const updated = await prisma.employee.update({
      where: { id: data.id },
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        employeeType: data.employeeType,
        joiningDate: data.joiningDate ? new Date(data.joiningDate) : null,
        notes: data.notes,
        managerId: data.managerId || null,
        teamLeadId: data.teamLeadId || null,
        ...(canChangeRole
          ? { roleId: data.roleId, departmentId: data.departmentId || null }
          : {}),
      },
    });

    await logActivity({
      actorId: session.user.id,
      action: "EMPLOYEE_UPDATED",
      entityType: "Employee",
      entityId: updated.id,
      description: `${session.user.name} updated ${updated.fullName}'s profile`,
    });

    revalidatePath("/team");
    revalidatePath(`/team/${data.id}`);
    return { success: true };
  } catch {
    return { error: "Unable to save changes. Please try again." };
  }
}

export async function changeEmployeeStatus(employeeId: string, status: "ACTIVE" | "INACTIVE" | "SUSPENDED") {
  const session = await requireActionPermission("employees.changeStatus");

  const employee = await prisma.employee.update({
    where: { id: employeeId },
    data: {
      status,
      deactivatedAt: status === "ACTIVE" ? null : new Date(),
    },
  });

  await logActivity({
    actorId: session.user.id,
    action: status === "ACTIVE" ? "EMPLOYEE_ACTIVATED" : status === "SUSPENDED" ? "EMPLOYEE_SUSPENDED" : "EMPLOYEE_DEACTIVATED",
    entityType: "Employee",
    entityId: employee.id,
    description: `${session.user.name} set ${employee.fullName}'s status to ${status}`,
  });

  revalidatePath("/team");
  revalidatePath(`/team/${employeeId}`);
  return { ok: true };
}

export async function resetEmployeePassword(employeeId: string): Promise<{ tempPassword: string }> {
  const session = await requireActionPermission("employees.resetPassword");

  const tempPassword = randomTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  const employee = await prisma.employee.update({
    where: { id: employeeId },
    data: { passwordHash, mustChangePassword: true },
  });

  await logActivity({
    actorId: session.user.id,
    action: "PASSWORD_RESET",
    entityType: "Employee",
    entityId: employee.id,
    description: `${session.user.name} issued a temporary password for ${employee.fullName}`,
  });

  revalidatePath(`/team/${employeeId}`);
  return { tempPassword };
}
