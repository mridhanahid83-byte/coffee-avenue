import "server-only";
import { prisma } from "@/lib/prisma";

export async function logActivity(input: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  description: string;
}) {
  return prisma.activityLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      description: input.description,
    },
  });
}
