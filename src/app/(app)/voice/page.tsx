import Link from "next/link";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { isLiveKitConfigured, getParticipantCounts } from "@/lib/livekit";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { VoiceChannelForm } from "@/components/voice/voice-channel-form";
import { VoiceChannelDeleteButton } from "@/components/voice/voice-channel-delete-button";
import { VoiceChannelInviteButton } from "@/components/voice/voice-channel-invite-button";
import { VoiceChannelMemberRemoveButton } from "@/components/voice/voice-channel-member-remove-button";
import { Mic, Users, Lock } from "lucide-react";
import type { Prisma } from "@prisma/client";

export default async function VoicePage() {
  const session = await requirePagePermission("voice.view");
  const canManage = hasPermission(session.user.permissions, "voice.manage");
  const canJoin = hasPermission(session.user.permissions, "voice.join");

  const employees = await prisma.employee.findMany({
    where: { status: "ACTIVE", id: { not: session.user.id } },
    orderBy: { fullName: "asc" },
    select: { id: true, fullName: true },
  });

  const where: Prisma.VoiceChannelWhereInput = canManage
    ? {}
    : { OR: [{ isPrivate: false }, { members: { some: { employeeId: session.user.id } } }] };

  const channels = await prisma.voiceChannel.findMany({
    where,
    include: { members: { include: { employee: true } } },
    orderBy: { name: "asc" },
  });
  const counts = await getParticipantCounts(channels.map((c) => c.id));
  const configured = isLiveKitConfigured();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Voice Channels</h1>
          <p className="text-sm text-[var(--muted)]">
            Live audio, video and screen share for office work and meetings — no scheduling needed, just join.
          </p>
        </div>
        {canManage && <VoiceChannelForm employees={employees} />}
      </div>

      {!configured && (
        <Card className="border-[var(--warning)]/30 bg-[var(--warning-soft)]">
          <CardContent className="pt-5 text-sm text-[var(--warning)]">
            Voice channels aren&apos;t connected to a live calling service yet. An administrator needs to set{" "}
            <code className="rounded bg-[var(--surface-2)] px-1 py-0.5 text-xs">LIVEKIT_API_KEY</code>,{" "}
            <code className="rounded bg-[var(--surface-2)] px-1 py-0.5 text-xs">LIVEKIT_API_SECRET</code> and{" "}
            <code className="rounded bg-[var(--surface-2)] px-1 py-0.5 text-xs">LIVEKIT_URL</code> in Settings → environment
            variables. Channels can still be created below, but joining won&apos;t work until that&apos;s done.
          </CardContent>
        </Card>
      )}

      {channels.length === 0 ? (
        <EmptyState
          icon={Mic}
          title="No voice channels yet"
          description="Create a channel so the team can hop on a call, share their screen and work together live."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((c) => {
            const liveCount = counts[c.id] ?? 0;
            const cardInner = (
              <CardContent className="flex flex-col gap-3 pt-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
                      <Mic className="h-4 w-4 text-[var(--accent)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-[var(--foreground)]">{c.name}</p>
                        {c.isPrivate && <Lock className="h-3 w-3 text-[var(--muted)]" />}
                      </div>
                      {c.description && <p className="text-xs text-[var(--muted)]">{c.description}</p>}
                    </div>
                  </div>
                  {canManage && <VoiceChannelDeleteButton channelId={c.id} />}
                </div>

                {c.isPrivate && c.members.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {c.members.map((m) => (
                      <span
                        key={m.id}
                        className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-[11px] text-[var(--foreground)]"
                      >
                        {m.employee.fullName}
                        {canManage && <VoiceChannelMemberRemoveButton channelId={c.id} employeeId={m.employeeId} />}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <Badge variant={liveCount > 0 ? "success" : "neutral"}>
                    <Users className="h-3 w-3" /> {liveCount} {liveCount === 1 ? "person" : "people"} live
                  </Badge>
                  <div className="flex items-center gap-2">
                    {canJoin && <VoiceChannelInviteButton channelId={c.id} employees={employees} />}
                    {canJoin && <span className="text-xs font-medium text-[var(--accent)]">Join →</span>}
                  </div>
                </div>
              </CardContent>
            );

            return canJoin ? (
              <Link key={c.id} href={`/voice/${c.id}`}>
                <Card className="h-full transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]">
                  {cardInner}
                </Card>
              </Link>
            ) : (
              <Card key={c.id} className="h-full">
                {cardInner}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
