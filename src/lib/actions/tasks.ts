"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireActionPermission, ForbiddenError } from "@/lib/auth-guard";
import { hasPermission } from "@/lib/permissions";
import { logActivity } from "@/lib/activity";
import { notify } from "@/lib/notifications";
import type { TaskStatus } from "@prisma/client";

export type TaskFormState = { error?: string; success?: boolean; taskId?: string };

const taskSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  clientId: z.string().optional(),
  departmentId: z.string().optional(),
  assigneeId: z.string().optional(),
  reviewerId: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  contentType: z.string().optional(),
  brief: z.string().optional(),
  referenceLink: z.string().optional(),
  startDate: z.string().optional(),
  deadline: z.string().optional(),
  requiresReview: z.string().optional(),
});

function parseTaskForm(formData: FormData) {
  return taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    clientId: formData.get("clientId") || undefined,
    departmentId: formData.get("departmentId") || undefined,
    assigneeId: formData.get("assigneeId") || undefined,
    reviewerId: formData.get("reviewerId") || undefined,
    priority: formData.get("priority") ?? "MEDIUM",
    contentType: formData.get("contentType") || undefined,
    brief: formData.get("brief") || undefined,
    referenceLink: formData.get("referenceLink") || undefined,
    startDate: formData.get("startDate") || undefined,
    deadline: formData.get("deadline") || undefined,
    requiresReview: formData.get("requiresReview") || undefined,
  });
}

export async function createTask(_prev: TaskFormState, formData: FormData): Promise<TaskFormState> {
  const session = await requireActionPermission("tasks.create");
  const parsed = parseTaskForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  try {
    const task = await prisma.task.create({
      data: {
        title: d.title,
        description: d.description,
        clientId: d.clientId || null,
        departmentId: d.departmentId || null,
        assigneeId: d.assigneeId || null,
        assignedById: session.user.id,
        reviewerId: d.reviewerId || null,
        priority: d.priority,
        contentType: d.contentType,
        brief: d.brief,
        referenceLink: d.referenceLink,
        startDate: d.startDate ? new Date(d.startDate) : null,
        deadline: d.deadline ? new Date(d.deadline) : null,
        requiresReview: d.requiresReview !== "false",
        status: "NOT_STARTED",
      },
    });

    await prisma.taskActivity.create({
      data: {
        taskId: task.id,
        actorId: session.user.id,
        action: "TASK_CREATED",
        toValue: "NOT_STARTED",
        note: d.assigneeId ? "Task created and assigned" : "Task created",
      },
    });

    await logActivity({
      actorId: session.user.id,
      action: "TASK_CREATED",
      entityType: "Task",
      entityId: task.id,
      description: `${session.user.name} created task "${task.title}"`,
    });

    if (d.assigneeId) {
      await notify({
        employeeId: d.assigneeId,
        type: "TASK_ASSIGNED",
        title: "New task assigned",
        message: `${session.user.name} assigned you: ${task.title}`,
        link: `/tasks/${task.id}`,
      });
    }

    revalidatePath("/tasks");
    return { success: true, taskId: task.id };
  } catch {
    return { error: "Unable to save task. Please try again." };
  }
}

export async function updateTaskFields(_prev: TaskFormState, formData: FormData): Promise<TaskFormState> {
  const session = await requireActionPermission("tasks.editRestrictedFields");
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing task id." };
  const parsed = parseTaskForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  try {
    const before = await prisma.task.findUnique({ where: { id } });
    if (!before) return { error: "Task not found." };

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: d.title,
        description: d.description,
        clientId: d.clientId || null,
        departmentId: d.departmentId || null,
        assigneeId: d.assigneeId || null,
        reviewerId: d.reviewerId || null,
        priority: d.priority,
        contentType: d.contentType,
        brief: d.brief,
        referenceLink: d.referenceLink,
        startDate: d.startDate ? new Date(d.startDate) : null,
        deadline: d.deadline ? new Date(d.deadline) : null,
        requiresReview: d.requiresReview !== "false",
      },
    });

    if (before.assigneeId !== task.assigneeId) {
      await prisma.taskActivity.create({
        data: { taskId: id, actorId: session.user.id, action: "TASK_REASSIGNED", note: "Assignee changed" },
      });
      if (task.assigneeId) {
        await notify({
          employeeId: task.assigneeId,
          type: "TASK_REASSIGNED",
          title: "Task reassigned to you",
          message: `${session.user.name} assigned you: ${task.title}`,
          link: `/tasks/${task.id}`,
        });
      }
    }
    if (before.deadline?.getTime() !== task.deadline?.getTime()) {
      await prisma.taskActivity.create({
        data: { taskId: id, actorId: session.user.id, action: "DEADLINE_CHANGED", note: "Deadline updated" },
      });
    }

    await logActivity({
      actorId: session.user.id,
      action: "TASK_UPDATED",
      entityType: "Task",
      entityId: id,
      description: `${session.user.name} updated task "${task.title}"`,
    });

    revalidatePath("/tasks");
    revalidatePath(`/tasks/${id}`);
    return { success: true, taskId: id };
  } catch {
    return { error: "Unable to save changes. Please try again." };
  }
}

async function assertTaskAccess(taskId: string) {
  const session = await auth();
  if (!session?.user) throw new ForbiddenError("Your session has expired. Please log in again.");
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new ForbiddenError("Task not found.");
  return { session, task };
}

type WorkflowAction = "start" | "submit" | "request_revision" | "approve" | "wait_client" | "resume" | "cancel" | "reopen";

export async function changeTaskStatus(
  taskId: string,
  action: WorkflowAction,
  extra?: { deliveryLink?: string; note?: string }
): Promise<{ error?: string; success?: boolean }> {
  const { session, task } = await assertTaskAccess(taskId);
  const perms = session.user.permissions;
  const isAssignee = task.assigneeId === session.user.id;
  const isReviewer = task.reviewerId === session.user.id;
  const canManage = hasPermission(perms, "tasks.assign") || hasPermission(perms, "tasks.editRestrictedFields");
  const canReview = hasPermission(perms, "tasks.review") && (isReviewer || canManage);
  const canOwnUpdate = hasPermission(perms, "tasks.updateOwn") && isAssignee;

  let nextStatus: TaskStatus | null = null;
  let activityAction = "";
  const activityNote = extra?.note;

  switch (action) {
    case "start":
      if (!(canOwnUpdate || canManage)) return { error: "Only the assignee can start this task." };
      if (task.status !== "NOT_STARTED") return { error: "Task has already been started." };
      nextStatus = "IN_PROGRESS";
      activityAction = "TASK_STARTED";
      break;
    case "wait_client":
      if (!(canOwnUpdate || canManage)) return { error: "Not authorized." };
      if (task.status !== "IN_PROGRESS") return { error: "Task must be in progress." };
      nextStatus = "WAITING_CLIENT";
      activityAction = "WAITING_ON_CLIENT";
      break;
    case "resume":
      if (!(canOwnUpdate || canManage)) return { error: "Not authorized." };
      if (task.status !== "WAITING_CLIENT") return { error: "Task is not waiting on a client." };
      nextStatus = "IN_PROGRESS";
      activityAction = "TASK_RESUMED";
      break;
    case "submit":
      if (!(canOwnUpdate || canManage)) return { error: "Only the assignee can submit this task." };
      if (!["IN_PROGRESS", "REVISION", "WAITING_CLIENT"].includes(task.status)) {
        return { error: "Task cannot be submitted from its current status." };
      }
      nextStatus = task.requiresReview ? "WAITING_REVIEW" : "COMPLETED";
      activityAction = task.requiresReview ? "DELIVERY_SUBMITTED" : "TASK_COMPLETED";
      break;
    case "request_revision":
      if (!canReview) return { error: "Only the reviewer can request a revision." };
      if (task.status !== "WAITING_REVIEW") return { error: "Task is not awaiting review." };
      nextStatus = "REVISION";
      activityAction = "REVISION_REQUESTED";
      break;
    case "approve":
      if (!canReview) return { error: "Only the reviewer can approve this task." };
      if (task.status !== "WAITING_REVIEW") return { error: "Task is not awaiting review." };
      nextStatus = "COMPLETED";
      activityAction = "TASK_APPROVED";
      break;
    case "cancel":
      if (!canManage) return { error: "Only management can cancel a task." };
      nextStatus = "CANCELLED";
      activityAction = "TASK_CANCELLED";
      break;
    case "reopen":
      if (!canManage) return { error: "Only management can reopen a task." };
      nextStatus = "NOT_STARTED";
      activityAction = "TASK_REOPENED";
      break;
  }

  if (!nextStatus) return { error: "Invalid action." };

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: nextStatus,
      deliveryLink: extra?.deliveryLink || task.deliveryLink,
      approvalStatus:
        nextStatus === "WAITING_REVIEW" ? "PENDING" : nextStatus === "COMPLETED" ? "APPROVED" : nextStatus === "REVISION" ? "REJECTED" : task.approvalStatus,
      completedAt: nextStatus === "COMPLETED" ? new Date() : null,
    },
  });

  await prisma.taskActivity.create({
    data: {
      taskId,
      actorId: session.user.id,
      action: activityAction,
      fromValue: task.status,
      toValue: nextStatus,
      note: activityNote,
    },
  });

  await logActivity({
    actorId: session.user.id,
    action: activityAction,
    entityType: "Task",
    entityId: taskId,
    description: `${session.user.name} moved task "${task.title}" from ${task.status} to ${nextStatus}`,
  });

  const notifyTargets: { employeeId: string; type: "TASK_REVISION" | "TASK_APPROVED"; title: string; message: string }[] = [];
  if (action === "request_revision" && task.assigneeId) {
    notifyTargets.push({
      employeeId: task.assigneeId,
      type: "TASK_REVISION",
      title: "Revision requested",
      message: `${session.user.name} requested changes on "${task.title}"${extra?.note ? `: ${extra.note}` : ""}`,
    });
  }
  if (action === "approve" && task.assigneeId) {
    notifyTargets.push({
      employeeId: task.assigneeId,
      type: "TASK_APPROVED",
      title: "Task approved",
      message: `${session.user.name} approved "${task.title}"`,
    });
  }
  if (action === "submit" && task.reviewerId) {
    await notify({
      employeeId: task.reviewerId,
      type: "TASK_APPROVED",
      title: "Delivery submitted for review",
      message: `${session.user.name} submitted "${task.title}" for review`,
      link: `/tasks/${taskId}`,
    });
  }
  for (const t of notifyTargets) {
    await notify({ ...t, link: `/tasks/${taskId}` });
  }

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function addTaskComment(taskId: string, body: string) {
  const { session, task } = await assertTaskAccess(taskId);
  if (!body.trim()) return { error: "Comment cannot be empty." };

  const comment = await prisma.taskComment.create({
    data: { taskId, authorId: session.user.id, body: body.trim() },
  });

  await prisma.taskActivity.create({
    data: { taskId, actorId: session.user.id, action: "COMMENT_ADDED" },
  });

  const recipients = new Set([task.assigneeId, task.assignedById, task.reviewerId].filter((x): x is string => !!x && x !== session.user.id));
  for (const employeeId of recipients) {
    await notify({
      employeeId,
      type: "COMMENT_ADDED",
      title: "New comment",
      message: `${session.user.name} commented on "${task.title}"`,
      link: `/tasks/${taskId}`,
    });
  }

  revalidatePath(`/tasks/${taskId}`);
  return { success: true, commentId: comment.id };
}
