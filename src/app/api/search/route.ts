import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ groups: [] }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ groups: [] });

  const perms = session.user.permissions;
  const groups: { label: string; items: { id: string; title: string; subtitle?: string; href: string }[] }[] = [];

  if (hasPermission(perms, "employees.view")) {
    const employees = await prisma.employee.findMany({
      where: { fullName: { contains: q, mode: "insensitive" } },
      take: 5,
      select: { id: true, fullName: true, email: true },
    });
    if (employees.length) {
      groups.push({
        label: "Employees",
        items: employees.map((e) => ({ id: e.id, title: e.fullName, subtitle: e.email, href: `/team/${e.id}` })),
      });
    }
  }

  if (hasPermission(perms, "clients.view")) {
    const clients = await prisma.client.findMany({
      where: { clientName: { contains: q, mode: "insensitive" } },
      take: 5,
      select: { id: true, clientName: true, companyName: true },
    });
    if (clients.length) {
      groups.push({
        label: "Clients",
        items: clients.map((c) => ({
          id: c.id,
          title: c.clientName,
          subtitle: c.companyName ?? undefined,
          href: `/clients/${c.id}`,
        })),
      });
    }
  }

  if (hasPermission(perms, "tasks.viewAll") || hasPermission(perms, "tasks.viewOwn")) {
    const tasks = await prisma.task.findMany({
      where: {
        title: { contains: q, mode: "insensitive" },
        ...(hasPermission(perms, "tasks.viewAll") ? {} : { assigneeId: session.user.id }),
      },
      take: 5,
      select: { id: true, title: true, status: true },
    });
    if (tasks.length) {
      groups.push({
        label: "Tasks",
        items: tasks.map((t) => ({ id: t.id, title: t.title, subtitle: t.status, href: `/tasks/${t.id}` })),
      });
    }
  }

  if (hasPermission(perms, "campaigns.view")) {
    const campaigns = await prisma.campaign.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: 5,
      select: { id: true, name: true, platform: true },
    });
    if (campaigns.length) {
      groups.push({
        label: "Campaigns",
        items: campaigns.map((c) => ({
          id: c.id,
          title: c.name,
          subtitle: c.platform ?? undefined,
          href: `/campaigns/${c.id}`,
        })),
      });
    }
  }

  if (hasPermission(perms, "content.view")) {
    const content = await prisma.contentItem.findMany({
      where: { title: { contains: q, mode: "insensitive" } },
      take: 5,
      select: { id: true, title: true, contentType: true },
    });
    if (content.length) {
      groups.push({
        label: "Content",
        items: content.map((c) => ({ id: c.id, title: c.title, subtitle: c.contentType, href: `/content/${c.id}` })),
      });
    }
  }

  return NextResponse.json({ groups });
}
