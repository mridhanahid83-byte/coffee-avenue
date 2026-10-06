import "server-only";
import { AccessToken } from "livekit-server-sdk";
import { RoomServiceClient } from "livekit-server-sdk";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Voice channels require LIVEKIT_API_KEY, LIVEKIT_API_SECRET and LIVEKIT_URL — see DEPLOYMENT.md.`
    );
  }
  return value;
}

export function isLiveKitConfigured() {
  return !!(process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET && process.env.LIVEKIT_URL);
}

export async function createVoiceChannelToken(input: { roomName: string; identity: string; name: string }) {
  const apiKey = requireEnv("LIVEKIT_API_KEY");
  const apiSecret = requireEnv("LIVEKIT_API_SECRET");

  const token = new AccessToken(apiKey, apiSecret, {
    identity: input.identity,
    name: input.name,
    ttl: "4h",
  });
  token.addGrant({
    room: input.roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return await token.toJwt();
}

export function getRoomServiceClient() {
  const apiKey = requireEnv("LIVEKIT_API_KEY");
  const apiSecret = requireEnv("LIVEKIT_API_SECRET");
  const url = requireEnv("LIVEKIT_URL").replace(/^wss:/, "https:").replace(/^ws:/, "http:");
  return new RoomServiceClient(url, apiKey, apiSecret);
}

/** Best-effort live participant counts per room name. Returns {} if LiveKit isn't reachable/configured. */
export async function getParticipantCounts(roomNames: string[]): Promise<Record<string, number>> {
  if (!isLiveKitConfigured() || roomNames.length === 0) return {};
  try {
    const client = getRoomServiceClient();
    const rooms = await client.listRooms(roomNames);
    const counts: Record<string, number> = {};
    for (const room of rooms) {
      counts[room.name] = room.numParticipants;
    }
    return counts;
  } catch {
    return {};
  }
}
