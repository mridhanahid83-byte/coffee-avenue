import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 12 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
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
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.roleId = (user as unknown as { roleId: string }).roleId;
        token.roleName = (user as unknown as { roleName: string }).roleName;
        token.roleSlug = (user as unknown as { roleSlug: string }).roleSlug;
        token.permissions = (user as unknown as { permissions: string[] }).permissions;
        token.departmentId = (user as unknown as { departmentId: string | null }).departmentId;
        token.departmentName = (user as unknown as { departmentName: string | null }).departmentName;
        token.mustChangePassword = (user as unknown as { mustChangePassword: boolean }).mustChangePassword;
      }
      if (trigger === "update" && session) {
        Object.assign(token, session);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roleId = token.roleId as string;
        session.user.roleName = token.roleName as string;
        session.user.roleSlug = token.roleSlug as string;
        session.user.permissions = token.permissions as string[];
        session.user.departmentId = token.departmentId as string | null;
        session.user.departmentName = token.departmentName as string | null;
        session.user.mustChangePassword = token.mustChangePassword as boolean;
      }
      return session;
    },
  },
});
