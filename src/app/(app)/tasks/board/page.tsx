import Link from "next/link";
import { Plus } from "lucide-react";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import type { Prisma, TaskStatus, TaskPriority } from "@prisma/client";

export default async function TaskBoardPage({
  searchParams,
}: {
  searchParams: Promise<{
    department?: string;
    client?: string;
    assignee?: string;
    status?: string;
    priority?: string;
    q?: string;
    overdue?: string;
    dueToday?: string;
    dueTomorrow?: string;
    dueThisWeek?: string;
    completedToday?: string;
  }>;
}) {
  const session = await requirePagePermission("tasks.viewAll");
  const params = await searchParams;
  const canCreate = hasPermission(session.user.permissions, "tasks.create");

  const [departments, clients, employees] = await Promise.all([
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.client.findMany({ where: { status: { notIn: ["ARCHIVED"] } }, orderBy: { clientName: "asc" } }),
    prisma.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" } }),
  ]);

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const tomorrowEnd = new Date(todayEnd);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
  const weekEnd = new Date(todayEnd);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const where: Prisma.TaskWhereInput = {
    ...(params.department ? { departmentId: params.department } : {}),
    ...(params.client ? { clientId: params.client } : {}),
    ...(params.assignee ? { assigneeId: params.assignee } : {}),
    ...(params.status ? { status: params.status as TaskStatus } : {}),
    ...(params.priority ? { priority: params.priority as TaskPriority } : {}),
    ...(params.q ? { title: { contains: params.q, mode: "insensitive" } } : {}),
    ...(params.overdue ? { deadline: { lt: todayStart }, status: { notIn: ["COMPLETED", "CANCELLED"] } } : {}),
    ...(params.dueToday ? { deadline: { gte: todayStart, lte: todayEnd }, status: { notIn: ["COMPLETED", "CANCELLED"] } } : {}),
    ...(params.dueTomorrow ? { deadline: { gte: tomorrowStart, lte: tomorrowEnd }, status: { notIn: ["COMPLETED", "CANCELLED"] } } : {}),
    ...(params.dueThisWeek ? { deadline: { gte: todayStart, lte: weekEnd }, status: { notIn: ["COMPLETED", "CANCELLED"] } } : {}),
    ...(params.completedToday ? { status: "COMPLETED", completedAt: { gte: todayStart, lte: todayEnd } } : {}),
  };

  const tasks = await prisma.task.findMany({
    where,
    include: { client: true, assignee: true, department: true },
    orderBy: [{ status: "asc" }, { deadline: "asc" }],
  });

  const selectedDept = departments.find((d) => d.id === params.department);
  const showContentType = selectedDept?.name === "Design";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">All Tasks</h1>
          <p className="text-sm text-[var(--muted)]">{tasks.length} task{tasks.length === 1 ? "" : "s"} across the agency</p>
        </div>
        {canCreate && (
          <Link href="/tasks/new">
            <Button>
              <Plus className="h-4 w-4" /> New Task
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <form className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-6">
          <Input name="q" placeholder="Search title" defaultValue={params.q} className="lg:col-span-2" />
          <Select name="department" defaultValue={params.department ?? ""}>
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
          <Select name="client" defaultValue={params.client ?? ""}>
            <option value="">All clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.clientName}
              </option>
            ))}
          </Select>
          <Select name="assignee" defaultValue={params.assignee ?? ""}>
            <option value="">All assignees</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.fullName}
              </option>
            ))}
          </Select>
          <Select name="priority" defaultValue={params.priority ?? ""}>
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </Select>
          <Select name="status" defaultValue={params.status ?? ""}>
            <option value="">All statuses</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_CLIENT">Waiting for Client</option>
            <option value="WAITING_REVIEW">Waiting for Review</option>
            <option value="REVISION">Revision</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </Select>
          <div className="lg:col-span-6">
            <Button type="submit" variant="secondary" size="sm">
              Apply filters
            </Button>
          </div>
        </form>
      </Card>

      {tasks.length === 0 ? (
        <EmptyState title="No tasks assigned." description="Try adjusting your filters or create a new task." actionHref={canCreate ? "/tasks/new" : undefined} actionLabel={canCreate ? "New Task" : undefined} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Department</TableHead>
              {showContentType && <TableHead>Content type</TableHead>}
              <TableHead>Assignee</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <Link href={`/tasks/${t.id}`} className="font-medium text-[var(--foreground)] hover:text-[var(--accent)]">
                    {t.title}
                  </Link>
                </TableCell>
                <TableCell>{t.client?.clientName ?? "—"}</TableCell>
                <TableCell>{t.department?.name ?? "—"}</TableCell>
                {showContentType && <TableCell>{t.contentType ?? "—"}</TableCell>}
                <TableCell>{t.assignee?.fullName ?? "Unassigned"}</TableCell>
                <TableCell>
                  <StatusBadge type="taskPriority" value={t.priority} />
                </TableCell>
                <TableCell>{formatDate(t.deadline)}</TableCell>
                <TableCell>
                  <StatusBadge type="taskStatus" value={t.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
