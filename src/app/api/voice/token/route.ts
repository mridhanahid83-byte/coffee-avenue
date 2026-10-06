import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createVoiceChannelToken, isLiveKitConfigured } from "@/lib/livekit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Your session has expired. Please log in again." }, { status: 401 });
  }
  if (!hasPermission(session.user.permissions, "voice.join")) {
    return NextResponse.json({ error: "Only authorized users can perform this action." }, { status: 403 });
  }
  if (!isLiveKitConfigured()) {
    return NextResponse.json(
      { error: "Voice channels are not configured yet. An administrator needs to set LIVEKIT_API_KEY, LIVEKIT_API_SECRET and LIVEKIT_URL." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const channelId = String(body.channelId ?? "");
  if (!channelId) return NextResponse.json({ error: "Missing channel." }, { status: 400 });

  const channel = await prisma.voiceChannel.findUnique({ where: { id: channelId } });
  if (!channel) return NextResponse.json({ error: "Voice channel not found." }, { status: 404 });

  const token = await createVoiceChannelToken({
    roomName: channel.id,
    identity: session.user.id,
    name: session.user.name ?? "Unknown",
  });

  return NextResponse.json({ token, url: process.env.LIVEKIT_URL, roomName: channel.id, channelName: channel.name });
}
