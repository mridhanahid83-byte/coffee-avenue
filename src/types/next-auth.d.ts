import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roleId: string;
      roleName: string;
      roleSlug: string;
      permissions: string[];
      departmentId: string | null;
      departmentName: string | null;
      mustChangePassword: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    roleId: string;
    roleName: string;
    roleSlug: string;
    permissions: string[];
    departmentId: string | null;
    departmentName: string | null;
    mustChangePassword: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roleId: string;
    roleName: string;
    roleSlug: string;
    permissions: string[];
    departmentId: string | null;
    departmentName: string | null;
    mustChangePassword: boolean;
  }
}
