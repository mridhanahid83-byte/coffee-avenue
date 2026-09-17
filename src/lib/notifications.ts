import "server-only";
import { prisma } from "@/lib/prisma";

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_REASSIGNED"
  | "DEADLINE_APPROACHING"
  | "TASK_OVERDUE"
  | "TASK_REVISION"
  | "TASK_APPROVED"
  | "COMMENT_ADDED"
  | "MENTION"
  | "LEAVE_STATUS"
  | "GENERAL";

export async function notify(input: {
  employeeId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
  return prisma.notification.create({
    data: {
      employeeId: input.employeeId,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link,
    },
  });
}

export async function notifyMany(
  employeeIds: string[],
  input: { type: NotificationType; title: string; message: string; link?: string }
) {
  const unique = Array.from(new Set(employeeIds));
  if (unique.length === 0) return;
  await prisma.notification.createMany({
    data: unique.map((employeeId) => ({
      employeeId,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link,
    })),
  });
}
