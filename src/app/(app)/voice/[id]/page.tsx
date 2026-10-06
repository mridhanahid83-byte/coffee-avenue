import { notFound, redirect } from "next/navigation";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { canAccessVoiceChannel } from "@/lib/voice-access";
import { VoiceRoom } from "@/components/voice/voice-room";
import { Badge } from "@/components/ui/badge";

export default async function VoiceChannelRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePagePermission("voice.join");
  const { id } = await params;

  const channel = await prisma.voiceChannel.findUnique({ where: { id } });
  if (!channel) notFound();

  const allowed = await canAccessVoiceChannel(id, session.user.id, session.user.permissions);
  if (!allowed) redirect("/voice?denied=1");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-[var(--foreground)]"># {channel.name}</h1>
        {channel.isPrivate && <Badge variant="accent">Private</Badge>}
      </div>
      {channel.description && <p className="-mt-2 text-sm text-[var(--muted)]">{channel.description}</p>}
      <VoiceRoom channelId={channel.id} channelName={channel.name} />
    </div>
  );
}
