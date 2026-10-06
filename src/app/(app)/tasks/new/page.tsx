import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { TaskForm } from "@/components/tasks/task-form";

export default async function NewTaskPage() {
  await requirePagePermission("tasks.create");

  const [clients, departments, employees] = await Promise.all([
    prisma.client.findMany({ where: { status: { notIn: ["ARCHIVED"] } }, orderBy: { clientName: "asc" } }),
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-lg font-semibold text-[var(--foreground)]">New Task</h1>
      <p className="mb-6 text-sm text-[var(--muted)]">Create and assign a task. The assignee will be notified immediately.</p>
      <TaskForm
        mode="create"
        clients={clients.map((c) => ({ id: c.id, name: c.clientName }))}
        departments={departments}
        employees={employees.map((e) => ({ id: e.id, fullName: e.fullName }))}
      />
    </div>
  );
}
