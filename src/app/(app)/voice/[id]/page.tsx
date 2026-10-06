import { notFound } from "next/navigation";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { VoiceRoom } from "@/components/voice/voice-room";

export default async function VoiceChannelRoomPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePagePermission("voice.join");
  const { id } = await params;

  const channel = await prisma.voiceChannel.findUnique({ where: { id } });
  if (!channel) notFound();

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]"># {channel.name}</h1>
        {channel.description && <p className="text-sm text-[var(--muted)]">{channel.description}</p>}
      </div>
      <VoiceRoom channelId={channel.id} channelName={channel.name} />
    </div>
  );
}
