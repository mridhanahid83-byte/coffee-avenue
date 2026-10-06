"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionPermission } from "@/lib/auth-guard";
import { logActivity } from "@/lib/activity";
import { notify } from "@/lib/notifications";

const STAGES = ["BRIEF", "COPY", "DESIGN", "INTERNAL_REVIEW", "CLIENT_APPROVAL", "REVISION", "APPROVED", "PUBLISHED"] as const;

const contentSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  title: z.string().min(2, "Title is required"),
  contentType: z.string().min(1, "Content type is required"),
  stage: z.enum(STAGES),
  copyStatus: z.string().optional(),
  designStatus: z.string().optional(),
  internalReview: z.string().optional(),
  clientApproval: z.string().optional(),
  revisionNotes: z.string().optional(),
  publishingStatus: z.string().optional(),
  assigneeId: z.string().optional(),
  deadline: z.string().optional(),
  publishedDate: z.string().optional(),
});

export type ContentFormState = { error?: string; success?: boolean; contentId?: string };

function parse(formData: FormData) {
  return contentSchema.safeParse({
    clientId: formData.get("clientId"),
    title: formData.get("title"),
    contentType: formData.get("contentType"),
    stage: formData.get("stage") ?? "BRIEF",
    copyStatus: formData.get("copyStatus") || undefined,
    designStatus: formData.get("designStatus") || undefined,
    internalReview: formData.get("internalReview") || undefined,
    clientApproval: formData.get("clientApproval") || undefined,
    revisionNotes: formData.get("revisionNotes") || undefined,
    publishingStatus: formData.get("publishingStatus") || undefined,
    assigneeId: formData.get("assigneeId") || undefined,
    deadline: formData.get("deadline") || undefined,
    publishedDate: formData.get("publishedDate") || undefined,
  });
}

export async function createContentItem(_prev: ContentFormState, formData: FormData): Promise<ContentFormState> {
  const session = await requireActionPermission("content.manage");
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  const item = await prisma.contentItem.create({
    data: {
      clientId: d.clientId,
      title: d.title,
      contentType: d.contentType,
      stage: d.stage,
      copyStatus: d.copyStatus,
      designStatus: d.designStatus,
      internalReview: d.internalReview,
      clientApproval: d.clientApproval,
      revisionNotes: d.revisionNotes,
      publishingStatus: d.publishingStatus,
      assigneeId: d.assigneeId || null,
      deadline: d.deadline ? new Date(d.deadline) : null,
      publishedDate: d.publishedDate ? new Date(d.publishedDate) : null,
    },
  });

  await logActivity({
    actorId: session.user.id,
    action: "CONTENT_CREATED",
    entityType: "ContentItem",
    entityId: item.id,
    description: `${session.user.name} created content "${item.title}"`,
  });

  if (d.assigneeId) {
    await notify({
      employeeId: d.assigneeId,
      type: "TASK_ASSIGNED",
      title: "New content assigned",
      message: `${session.user.name} assigned you content: ${item.title}`,
      link: `/content/${item.id}`,
    });
  }

  revalidatePath("/content");
  return { success: true, contentId: item.id };
}

export async function updateContentItem(_prev: ContentFormState, formData: FormData): Promise<ContentFormState> {
  const session = await requireActionPermission("content.manage");
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing content id." };
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  const before = await prisma.contentItem.findUnique({ where: { id } });
  if (!before) return { error: "Content item not found." };

  const item = await prisma.contentItem.update({
    where: { id },
    data: {
      clientId: d.clientId,
      title: d.title,
      contentType: d.contentType,
      stage: d.stage,
      copyStatus: d.copyStatus,
      designStatus: d.designStatus,
      internalReview: d.internalReview,
      clientApproval: d.clientApproval,
      revisionNotes: d.revisionNotes,
      publishingStatus: d.publishingStatus,
      assigneeId: d.assigneeId || null,
      deadline: d.deadline ? new Date(d.deadline) : null,
      publishedDate: d.publishedDate ? new Date(d.publishedDate) : null,
    },
  });

  if (before.stage !== item.stage) {
    await logActivity({
      actorId: session.user.id,
      action: "CONTENT_STAGE_CHANGED",
      entityType: "ContentItem",
      entityId: item.id,
      description: `${session.user.name} moved "${item.title}" from ${before.stage} to ${item.stage}`,
    });
  } else {
    await logActivity({
      actorId: session.user.id,
      action: "CONTENT_UPDATED",
      entityType: "ContentItem",
      entityId: item.id,
      description: `${session.user.name} updated "${item.title}"`,
    });
  }

  revalidatePath("/content");
  revalidatePath(`/content/${id}`);
  return { success: true, contentId: id };
}
