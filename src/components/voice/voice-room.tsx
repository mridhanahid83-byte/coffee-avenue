"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export function VoiceRoom({ channelId, channelName }: { channelId: string; channelName: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/voice/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to join voice channel.");
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        setToken(data.token);
        setServerUrl(data.url);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [channelId]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-[var(--danger)]">{error}</p>
        <Button variant="secondary" onClick={() => router.push("/voice")}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to voice channels
        </Button>
      </div>
    );
  }

  if (!token || !serverUrl) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
        <p className="text-sm text-[var(--muted)]">Connecting to {channelName}…</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-7.5rem)] flex-col overflow-hidden rounded-xl border border-[var(--border)]">
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect
        audio
        video={false}
        data-lk-theme="default"
        style={{ height: "100%" }}
        onDisconnected={() => router.push("/voice")}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}
