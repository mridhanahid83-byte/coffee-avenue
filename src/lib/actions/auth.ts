"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthError } from "next-auth";
import { requireSession } from "@/lib/auth-guard";
import { logActivity } from "@/lib/activity";

export type LoginFormState = { error?: string };

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(_prev: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw err;
  }

  return {};
}

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordState = { error?: string; success?: boolean };

export async function changePasswordAction(
  _prev: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await requireSession();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const employee = await prisma.employee.findUnique({ where: { id: session.user.id } });
  if (!employee) return { error: "Account not found." };

  const valid = await bcrypt.compare(parsed.data.currentPassword, employee.passwordHash);
  if (!valid) return { error: "Current password is incorrect." };

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.employee.update({
    where: { id: employee.id },
    data: { passwordHash, mustChangePassword: false },
  });

  await logActivity({
    actorId: employee.id,
    action: "PASSWORD_CHANGED",
    entityType: "Employee",
    entityId: employee.id,
    description: `${employee.fullName} changed their password`,
  });

  return { success: true };
}

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
});

export type ProfileFormState = { error?: string; success?: boolean };

export async function updateOwnProfile(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const session = await requireSession();
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  await prisma.employee.update({
    where: { id: session.user.id },
    data: { fullName: parsed.data.fullName, phone: parsed.data.phone },
  });

  await logActivity({
    actorId: session.user.id,
    action: "PROFILE_UPDATED",
    entityType: "Employee",
    entityId: session.user.id,
    description: `${parsed.data.fullName} updated their profile`,
  });

  return { success: true };
}
