"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionPermission } from "@/lib/auth-guard";
import { logActivity } from "@/lib/activity";

const campaignSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  name: z.string().min(2, "Campaign name is required"),
  platform: z.string().optional(),
  objective: z.string().optional(),
  budget: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  responsibleId: z.string().optional(),
  status: z.enum(["PLANNED", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"]),
  notes: z.string().optional(),
  reportLink: z.string().optional(),
});

export type CampaignFormState = { error?: string; success?: boolean; campaignId?: string };

function parse(formData: FormData) {
  return campaignSchema.safeParse({
    clientId: formData.get("clientId"),
    name: formData.get("name"),
    platform: formData.get("platform") || undefined,
    objective: formData.get("objective") || undefined,
    budget: formData.get("budget") || undefined,
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
    responsibleId: formData.get("responsibleId") || undefined,
    status: formData.get("status") ?? "PLANNED",
    notes: formData.get("notes") || undefined,
    reportLink: formData.get("reportLink") || undefined,
  });
}

export async function createCampaign(_prev: CampaignFormState, formData: FormData): Promise<CampaignFormState> {
  const session = await requireActionPermission("campaigns.manage");
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  const campaign = await prisma.campaign.create({
    data: {
      clientId: d.clientId,
      name: d.name,
      platform: d.platform,
      objective: d.objective,
      budget: d.budget ? Number(d.budget) : undefined,
      startDate: d.startDate ? new Date(d.startDate) : undefined,
      endDate: d.endDate ? new Date(d.endDate) : undefined,
      responsibleId: d.responsibleId || undefined,
      status: d.status,
      notes: d.notes,
      reportLink: d.reportLink,
    },
  });

  await logActivity({
    actorId: session.user.id,
    action: "CAMPAIGN_CREATED",
    entityType: "Campaign",
    entityId: campaign.id,
    description: `${session.user.name} created campaign "${campaign.name}"`,
  });

  revalidatePath("/campaigns");
  return { success: true, campaignId: campaign.id };
}

export async function updateCampaign(_prev: CampaignFormState, formData: FormData): Promise<CampaignFormState> {
  const session = await requireActionPermission("campaigns.manage");
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing campaign id." };
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  const campaign = await prisma.campaign.update({
    where: { id },
    data: {
      clientId: d.clientId,
      name: d.name,
      platform: d.platform,
      objective: d.objective,
      budget: d.budget ? Number(d.budget) : null,
      startDate: d.startDate ? new Date(d.startDate) : null,
      endDate: d.endDate ? new Date(d.endDate) : null,
      responsibleId: d.responsibleId || null,
      status: d.status,
      notes: d.notes,
      reportLink: d.reportLink,
    },
  });

  await logActivity({
    actorId: session.user.id,
    action: "CAMPAIGN_UPDATED",
    entityType: "Campaign",
    entityId: campaign.id,
    description: `${session.user.name} updated campaign "${campaign.name}"`,
  });

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${id}`);
  return { success: true, campaignId: id };
}
