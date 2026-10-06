import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const employee = await prisma.employee.findUnique({
          where: { email },
          include: { role: true, department: true },
        });

        if (!employee) return null;
        if (employee.status !== "ACTIVE") return null;

        const valid = await bcrypt.compare(password, employee.passwordHash);
        if (!valid) return null;

        await prisma.employee.update({
          where: { id: employee.id },
          data: { lastLoginAt: new Date() },
        });

        await prisma.activityLog.create({
          data: {
            actorId: employee.id,
            action: "LOGIN",
            entityType: "Employee",
            entityId: employee.id,
            description: `${employee.fullName} logged in`,
          },
        });

        return {
          id: employee.id,
          name: employee.fullName,
          email: employee.email,
          image: employee.profilePhotoUrl,
          roleId: employee.role.id,
          roleName: employee.role.name,
          roleSlug: employee.role.slug,
          permissions: (employee.role.permissions as string[]) ?? [],
          departmentId: employee.departmentId,
          departmentName: employee.department?.name ?? null,
          mustChangePassword: employee.mustChangePassword,
        };
      },
    }),
  ],
});
