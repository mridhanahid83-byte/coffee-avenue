import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { TaskWorkflowActions } from "@/components/tasks/task-workflow-actions";
import { TaskCommentForm } from "@/components/tasks/task-comment-form";
import { formatDate, formatDateTime, initials } from "@/lib/utils";
import { Pencil, Link as LinkIcon, ExternalLink } from "lucide-react";

const ACTIVITY_LABELS: Record<string, string> = {
  TASK_CREATED: "Task created",
  TASK_STARTED: "Started work",
  WAITING_ON_CLIENT: "Marked waiting on client",
  TASK_RESUMED: "Resumed work",
  DELIVERY_SUBMITTED: "Delivery submitted",
  TASK_COMPLETED: "Marked completed",
  REVISION_REQUESTED: "Requested revision",
  TASK_APPROVED: "Approved delivery",
  TASK_CANCELLED: "Cancelled task",
  TASK_REOPENED: "Reopened task",
  TASK_REASSIGNED: "Reassigned task",
  DEADLINE_CHANGED: "Changed deadline",
  COMMENT_ADDED: "Commented",
};

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePagePermission("tasks.viewOwn");
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      client: true,
      department: true,
      assignee: true,
      assignedBy: true,
      reviewer: true,
      comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
      activities: { include: { actor: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!task) notFound();

  const canViewAll = hasPermission(session.user.permissions, "tasks.viewAll");
  const isAssignee = task.assigneeId === session.user.id;
  const isReviewer = task.reviewerId === session.user.id;
  if (!canViewAll && !isAssignee && !isReviewer) notFound();

  const canManage = hasPermission(session.user.permissions, "tasks.assign") || hasPermission(session.user.permissions, "tasks.editRestrictedFields");
  const canReview = hasPermission(session.user.permissions, "tasks.review") && (isReviewer || canManage);
  const canEdit = hasPermission(session.user.permissions, "tasks.editRestrictedFields");
  const overdue = task.deadline && task.deadline < new Date() && !["COMPLETED", "CANCELLED"].includes(task.status);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">{task.title}</h1>
            <StatusBadge type="taskPriority" value={task.priority} />
            <StatusBadge type="taskStatus" value={task.status} />
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {task.client ? (
              <Link href={`/clients/${task.client.id}`} className="hover:text-[var(--accent)]">
                {task.client.clientName}
              </Link>
            ) : (
              "Internal task"
            )}
            {task.department ? ` · ${task.department.name}` : ""}
            {task.deadline ? ` · Due ${formatDate(task.deadline)}` : ""}
            {overdue && <span className="ml-1 font-medium text-[var(--danger)]">(Overdue)</span>}
          </p>
        </div>
        {canEdit && (
          <Link href={`/tasks/${task.id}/edit`}>
            <Button variant="secondary">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              {task.description && <p className="text-[var(--foreground)]">{task.description}</p>}
              {task.brief && (
                <div>
                  <p className="text-xs text-[var(--muted)]">Brief</p>
                  <p className="text-[var(--foreground)]">{task.brief}</p>
                </div>
              )}
              {task.contentType && (
                <div>
                  <p className="text-xs text-[var(--muted)]">Content type</p>
                  <p className="text-[var(--foreground)]">{task.contentType}</p>
                </div>
              )}
              {task.referenceLink && (
                <a href={task.referenceLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[var(--accent)] hover:underline">
                  <LinkIcon className="h-3.5 w-3.5" /> Reference link <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {task.deliveryLink && (
                <a href={task.deliveryLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[var(--accent)] hover:underline">
                  <LinkIcon className="h-3.5 w-3.5" /> Delivery link <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {task.comments.length === 0 && <p className="text-sm text-[var(--muted)]">No comments yet.</p>}
              {task.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
                    {initials(c.author.fullName)}
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium text-[var(--foreground)]">{c.author.fullName}</span>{" "}
                      <span className="text-xs text-[var(--muted-2)]">{formatDateTime(c.createdAt)}</span>
                    </p>
                    <p className="text-sm text-[var(--foreground)]">{c.body}</p>
                  </div>
                </div>
              ))}
              <TaskCommentForm taskId={task.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-3 border-l border-[var(--border)] pl-4">
                {task.activities.map((a) => (
                  <li key={a.id} className="relative text-sm">
                    <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                    <p className="text-[var(--foreground)]">
                      {ACTIVITY_LABELS[a.action] ?? a.action}
                      {a.actor ? ` — ${a.actor.fullName}` : ""}
                    </p>
                    {a.note && <p className="text-xs text-[var(--muted)]">{a.note}</p>}
                    <p className="text-xs text-[var(--muted-2)]">{formatDateTime(a.createdAt)}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskWorkflowActions
                taskId={task.id}
                status={task.status}
                requiresReview={task.requiresReview}
                deliveryLink={task.deliveryLink}
                isAssignee={isAssignee}
                canReview={canReview}
                canManage={canManage}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>People</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <PersonRow label="Assignee" name={task.assignee?.fullName} />
              <PersonRow label="Assigned by" name={task.assignedBy?.fullName} />
              <PersonRow label="Reviewer" name={task.reviewer?.fullName} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dates</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <Row label="Created" value={formatDate(task.createdAt)} />
              <Row label="Start date" value={formatDate(task.startDate)} />
              <Row label="Deadline" value={formatDate(task.deadline)} />
              <Row label="Completed" value={formatDate(task.completedAt)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PersonRow({ label, name }: { label: string; name?: string | null }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="text-[var(--foreground)]">{name ?? "—"}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="text-[var(--foreground)]">{value}</span>
    </div>
  );
}
