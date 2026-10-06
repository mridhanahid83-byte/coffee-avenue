import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { toCsv, csvResponse } from "@/lib/csv";
import { formatDate } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.permissions, "reports.view")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const department = req.nextUrl.searchParams.get("department") ?? undefined;

  const tasks = await prisma.task.findMany({
    where: department ? { departmentId: department } : {},
    include: { client: true, assignee: true, department: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = tasks.map((t) => ({
    title: t.title,
    client: t.client?.clientName ?? "",
    department: t.department?.name ?? "",
    assignee: t.assignee?.fullName ?? "",
    priority: t.priority,
    status: t.status,
    deadline: formatDate(t.deadline),
    completedAt: formatDate(t.completedAt),
  }));

  const csv = toCsv(rows, [
    { key: "title", label: "Task" },
    { key: "client", label: "Client" },
    { key: "department", label: "Department" },
    { key: "assignee", label: "Assignee" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
    { key: "deadline", label: "Deadline" },
    { key: "completedAt", label: "Completed" },
  ]);

  return csvResponse("tasks-report.csv", csv);
}
