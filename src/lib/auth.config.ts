import NextAuth, { type NextAuthConfig } from "next-auth";

// Edge-safe auth config: no Prisma, no bcrypt, no providers. Middleware runs
// on every single request, so it must stay this light — it only needs to
// decode the already-signed JWT from the cookie, never to authenticate a
// fresh sign-in (that happens through the full config in auth.ts).
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt", maxAge: 12 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
  providers: [],
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
};

export const { auth } = NextAuth(authConfig);
