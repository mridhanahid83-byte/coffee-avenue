"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionPermission } from "@/lib/auth-guard";
import { logActivity } from "@/lib/activity";
import { notify } from "@/lib/notifications";
import { canAccessVoiceChannel } from "@/lib/voice-access";

export type VoiceFormState = { error?: string; success?: boolean };

const channelSchema = z.object({
  name: z.string().min(2, "Channel name is required").max(60),
  description: z.string().optional(),
  isPrivate: z.boolean(),
  memberIds: z.array(z.string()),
});

export async function createVoiceChannel(_prev: VoiceFormState, formData: FormData): Promise<VoiceFormState> {
  const session = await requireActionPermission("voice.manage");
  const parsed = channelSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    isPrivate: formData.get("isPrivate") === "true",
    memberIds: formData.getAll("memberIds").map(String),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  const existing = await prisma.voiceChannel.findUnique({ where: { name: d.name } });
  if (existing) return { error: "A voice channel with this name already exists." };

  const memberIds = d.isPrivate ? Array.from(new Set([...d.memberIds, session.user.id])) : [];

  const channel = await prisma.voiceChannel.create({
    data: {
      name: d.name,
      description: d.description,
      isPrivate: d.isPrivate,
      createdById: session.user.id,
      members: memberIds.length > 0 ? { create: memberIds.map((employeeId) => ({ employeeId })) } : undefined,
    },
  });

  await logActivity({
    actorId: session.user.id,
    action: "VOICE_CHANNEL_CREATED",
    entityType: "VoiceChannel",
    entityId: channel.id,
    description: `${session.user.name} created ${d.isPrivate ? "private" : ""} voice channel "${channel.name}"`,
  });

  if (d.isPrivate) {
    const invitees = memberIds.filter((id) => id !== session.user.id);
    for (const employeeId of invitees) {
      await notify({
        employeeId,
        type: "VOICE_INVITE",
        title: "Added to a voice channel",
        message: `${session.user.name} added you to the private voice channel "${channel.name}"`,
        link: `/voice/${channel.id}`,
      });
    }
  }

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

export async function inviteToVoiceChannel(channelId: string, employeeIds: string[]): Promise<VoiceFormState> {
  const session = await requireActionPermission("voice.join");

  const channel = await prisma.voiceChannel.findUnique({ where: { id: channelId } });
  if (!channel) return { error: "Voice channel not found." };

  const allowed = await canAccessVoiceChannel(channelId, session.user.id, session.user.permissions);
  if (!allowed) return { error: "Only authorized users can perform this action." };

  const targets = employeeIds.filter((id) => id !== session.user.id);
  if (targets.length === 0) return { error: "Select at least one teammate to invite." };

  if (channel.isPrivate) {
    await prisma.voiceChannelMember.createMany({
      data: targets.map((employeeId) => ({ channelId, employeeId })),
      skipDuplicates: true,
    });
  }

  for (const employeeId of targets) {
    await notify({
      employeeId,
      type: "VOICE_INVITE",
      title: "Voice channel invite",
      message: `${session.user.name} invited you to join "${channel.name}" right now`,
      link: `/voice/${channel.id}`,
    });
  }

  await logActivity({
    actorId: session.user.id,
    action: "VOICE_CHANNEL_INVITE",
    entityType: "VoiceChannel",
    entityId: channel.id,
    description: `${session.user.name} invited ${targets.length} teammate${targets.length === 1 ? "" : "s"} to "${channel.name}"`,
  });

  revalidatePath("/voice");
  revalidatePath(`/voice/${channelId}`);
  return { success: true };
}

export async function removeVoiceChannelMember(channelId: string, employeeId: string): Promise<VoiceFormState> {
  const session = await requireActionPermission("voice.manage");

  await prisma.voiceChannelMember.delete({
    where: { channelId_employeeId: { channelId, employeeId } },
  });

  await logActivity({
    actorId: session.user.id,
    action: "VOICE_CHANNEL_MEMBER_REMOVED",
    entityType: "VoiceChannel",
    entityId: channelId,
    description: `${session.user.name} removed a member from a voice channel`,
  });

  revalidatePath("/voice");
  return { success: true };
}
