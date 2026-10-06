import Link from "next/link";
import { ListChecks, Plus, LayoutGrid } from "lucide-react";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import type { Task } from "@prisma/client";

export default async function MyTasksPage() {
  const session = await requirePagePermission("tasks.viewOwn");
  const canCreate = hasPermission(session.user.permissions, "tasks.create");
  const canViewAll = hasPermission(session.user.permissions, "tasks.viewAll");

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const tasks = await prisma.task.findMany({
    where: { assigneeId: session.user.id, status: { notIn: ["CANCELLED"] } },
    include: { client: true },
    orderBy: { deadline: "asc" },
  });

  const overdue = tasks.filter((t) => t.status !== "COMPLETED" && t.deadline && t.deadline < todayStart);
  const today = tasks.filter(
    (t) => t.status !== "COMPLETED" && t.deadline && t.deadline >= todayStart && t.deadline <= todayEnd
  );
  const upcoming = tasks.filter((t) => t.status !== "COMPLETED" && t.deadline && t.deadline > todayEnd);
  const noDeadline = tasks.filter((t) => t.status !== "COMPLETED" && !t.deadline);
  const completed = tasks.filter((t) => t.status === "COMPLETED").slice(0, 10);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">My Tasks</h1>
          <p className="text-sm text-[var(--muted)]">Your personal task queue across all clients</p>
        </div>
        <div className="flex gap-2">
          {canViewAll && (
            <Link href="/tasks/board">
              <Button variant="secondary">
                <LayoutGrid className="h-4 w-4" /> All tasks
              </Button>
            </Link>
          )}
          {canCreate && (
            <Link href="/tasks/new">
              <Button>
                <Plus className="h-4 w-4" /> New Task
              </Button>
            </Link>
          )}
        </div>
      </div>

      <TaskSection title="Overdue" tone="danger" tasks={overdue} emptyText="No overdue tasks. Great job staying on top of things." />
      <TaskSection title="Today" tone="accent" tasks={today} emptyText="Nothing due today." />
      <TaskSection title="Upcoming" tasks={[...upcoming, ...noDeadline]} emptyText="No upcoming tasks scheduled." />
      <TaskSection title="Completed" tasks={completed} emptyText="No completed tasks yet." collapsedByDefault />
    </div>
  );
}

function TaskSection({
  title,
  tasks,
  tone,
  emptyText,
}: {
  title: string;
  tasks: (Task & { client: { clientName: string } | null })[];
  tone?: "danger" | "accent";
  emptyText: string;
  collapsedByDefault?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className={tone === "danger" ? "text-[var(--danger)]" : tone === "accent" ? "text-[var(--accent)]" : undefined}>
          {title} ({tasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {tasks.length === 0 ? (
          <div className="px-5 pb-5">
            <EmptyState icon={ListChecks} title={emptyText} />
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {tasks.map((t) => (
              <li key={t.id}>
                <Link href={`/tasks/${t.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[var(--surface-hover)]">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--foreground)]">{t.title}</p>
                    <p className="text-xs text-[var(--muted)]">{t.client?.clientName ?? "Internal"} · Due {formatDate(t.deadline)}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <StatusBadge type="taskPriority" value={t.priority} />
                    <StatusBadge type="taskStatus" value={t.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
