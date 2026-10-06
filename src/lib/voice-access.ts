import "server-only";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

/** The real access gate for a voice channel: public channels are open to
 * anyone who can join voice channels at all; private ones are restricted to
 * their members plus anyone who can manage voice channels. Used both to
 * decide what's visible in lists and — critically — before issuing a
 * LiveKit token, since that token is the actual way into the call. */
export async function canAccessVoiceChannel(
  channelId: string,
  employeeId: string,
  permissions: string[]
): Promise<boolean> {
  const channel = await prisma.voiceChannel.findUnique({ where: { id: channelId } });
  if (!channel) return false;
  if (!channel.isPrivate) return true;
  if (hasPermission(permissions, "voice.manage")) return true;

  const membership = await prisma.voiceChannelMember.findUnique({
    where: { channelId_employeeId: { channelId, employeeId } },
  });
  return !!membership;
}
