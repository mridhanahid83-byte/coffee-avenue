import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import type { Session } from "next-auth";

export class ForbiddenError extends Error {
  constructor(message = "Only authorized users can perform this action.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** For use in server components / pages. Redirects to /login if unauthenticated. */
export async function requireSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

/** For use in server components / pages. Redirects if the user lacks the permission. */
export async function requirePagePermission(permission: string): Promise<Session> {
  const session = await requireSession();
  if (!hasPermission(session.user.permissions, permission)) {
    redirect("/dashboard?denied=1");
  }
  return session;
}

/** For use in server actions / API routes. Throws instead of redirecting. */
export async function requireActionPermission(permission: string): Promise<Session> {
  const session = await auth();
  if (!session?.user) throw new ForbiddenError("Your session has expired. Please log in again.");
  if (!hasPermission(session.user.permissions, permission)) {
    throw new ForbiddenError();
  }
  return session;
}

export async function getOptionalSession(): Promise<Session | null> {
  return auth();
}
