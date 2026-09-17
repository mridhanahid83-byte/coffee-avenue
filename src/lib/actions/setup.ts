"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/permissions";
import { DEFAULT_ROLES, DEFAULT_DEPARTMENTS, DEFAULT_LEAVE_TYPES, slugify } from "@/lib/seed-data";

const setupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function isSetupComplete() {
  const state = await prisma.systemState.findUnique({ where: { id: 1 } });
  return state?.setupComplete ?? false;
}

export type SetupFormState = { error?: string; success?: boolean };

export async function completeSetup(_prev: SetupFormState, formData: FormData): Promise<SetupFormState> {
  if (await isSetupComplete()) {
    return { error: "Setup has already been completed for this workspace." };
  }

  const parsed = setupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { fullName, email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await prisma.$transaction(
      async (tx) => {
        for (const role of DEFAULT_ROLES) {
          await tx.role.upsert({
            where: { slug: role.slug },
            create: {
              name: role.name,
              slug: role.slug,
              isSystem: role.isSystem,
              permissions: DEFAULT_ROLE_PERMISSIONS[role.slug] ?? [],
            },
            update: {},
          });
        }

        for (const name of DEFAULT_DEPARTMENTS) {
          const slug = slugify(name);
          await tx.department.upsert({
            where: { slug },
            create: { name, slug, isSystem: true },
            update: {},
          });
        }

        for (const lt of DEFAULT_LEAVE_TYPES) {
          await tx.leaveType.upsert({
            where: { name: lt.name },
            create: lt,
            update: {},
          });
        }

        const superAdminRole = await tx.role.findUniqueOrThrow({ where: { slug: "super_admin" } });

        const admin = await tx.employee.create({
          data: {
            fullName,
            email: email.toLowerCase(),
            passwordHash,
            roleId: superAdminRole.id,
            employeeType: "FULL_TIME",
            status: "ACTIVE",
            joiningDate: new Date(),
            mustChangePassword: false,
          },
        });

        await tx.activityLog.create({
          data: {
            actorId: admin.id,
            action: "SETUP_COMPLETE",
            entityType: "System",
            description: `${admin.fullName} completed initial workspace setup as Super Admin`,
          },
        });

        await tx.systemState.upsert({
          where: { id: 1 },
          create: { id: 1, setupComplete: true },
          update: { setupComplete: true },
        });
      },
      { timeout: 20000, maxWait: 10000 }
    );
  } catch (err) {
    console.error("[completeSetup] failed:", err);
    return { error: "Unable to complete setup. Please try again." };
  }

  return { success: true };
}
