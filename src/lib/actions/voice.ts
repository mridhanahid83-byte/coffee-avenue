"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionPermission } from "@/lib/auth-guard";
import { logActivity } from "@/lib/activity";

export type VoiceFormState = { error?: string; success?: boolean };

const channelSchema = z.object({
  name: z.string().min(2, "Channel name is required").max(60),
  description: z.string().optional(),
});

export async function createVoiceChannel(_prev: VoiceFormState, formData: FormData): Promise<VoiceFormState> {
  const session = await requireActionPermission("voice.manage");
  const parsed = channelSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await prisma.voiceChannel.findUnique({ where: { name: parsed.data.name } });
  if (existing) return { error: "A voice channel with this name already exists." };

  const channel = await prisma.voiceChannel.create({
    data: { name: parsed.data.name, description: parsed.data.description, createdById: session.user.id },
  });

  await logActivity({
    actorId: session.user.id,
    action: "VOICE_CHANNEL_CREATED",
    entityType: "VoiceChannel",
    entityId: channel.id,
    description: `${session.user.name} created voice channel "${channel.name}"`,
  });

  revalidatePath("/voice");
  return { success: true };
}

export async function deleteVoiceChannel(channelId: string): Promise<VoiceFormState> {
  const session = await requireActionPermission("voice.manage");
  const channel = await prisma.voiceChannel.delete({ where: { id: channelId } });

  await logActivity({
    actorId: session.user.id,
    action: "VOICE_CHANNEL_DELETED",
    entityType: "VoiceChannel",
    description: `${session.user.name} deleted voice channel "${channel.name}"`,
  });

  revalidatePath("/voice");
  return { success: true };
}
