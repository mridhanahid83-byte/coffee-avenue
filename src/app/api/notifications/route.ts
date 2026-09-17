import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ notifications: [], unreadCount: 0 }, { status: 401 });

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { employeeId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.notification.count({ where: { employeeId: session.user.id, isRead: false } }),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  if (body.markAllRead) {
    await prisma.notification.updateMany({
      where: { employeeId: session.user.id, isRead: false },
      data: { isRead: true },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.id) {
    await prisma.notification.updateMany({
      where: { id: body.id, employeeId: session.user.id },
      data: { isRead: true },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
