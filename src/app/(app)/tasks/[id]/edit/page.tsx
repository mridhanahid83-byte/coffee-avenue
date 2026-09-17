import { notFound } from "next/navigation";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { TaskForm } from "@/components/tasks/task-form";

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePagePermission("tasks.editRestrictedFields");
  const { id } = await params;

  const [task, clients, departments, employees] = await Promise.all([
    prisma.task.findUnique({ where: { id } }),
    prisma.client.findMany({ where: { status: { notIn: ["ARCHIVED"] } }, orderBy: { clientName: "asc" } }),
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" } }),
  ]);
  if (!task) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-lg font-semibold text-[var(--foreground)]">Edit task</h1>
      <p className="mb-6 text-sm text-[var(--muted)]">{task.title}</p>
      <TaskForm
        mode="edit"
        clients={clients.map((c) => ({ id: c.id, name: c.clientName }))}
        departments={departments}
        employees={employees.map((e) => ({ id: e.id, fullName: e.fullName }))}
        initial={{
          id: task.id,
          title: task.title,
          description: task.description,
          clientId: task.clientId,
          departmentId: task.departmentId,
          assigneeId: task.assigneeId,
          reviewerId: task.reviewerId,
          priority: task.priority,
          contentType: task.contentType,
          brief: task.brief,
          referenceLink: task.referenceLink,
          startDate: task.startDate ? task.startDate.toISOString().slice(0, 10) : null,
          deadline: task.deadline ? task.deadline.toISOString().slice(0, 10) : null,
          requiresReview: task.requiresReview,
        }}
      />
    </div>
  );
}
