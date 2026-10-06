"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteVoiceChannel } from "@/lib/actions/voice";

export function VoiceChannelDeleteButton({ channelId }: { channelId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(async () => {
          await deleteVoiceChannel(channelId);
          router.refresh();
        });
      }}
      className="text-[var(--muted)] hover:text-[var(--danger)]"
      title="Delete channel"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
