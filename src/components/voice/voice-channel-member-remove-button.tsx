"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { removeVoiceChannelMember } from "@/lib/actions/voice";

export function VoiceChannelMemberRemoveButton({ channelId, employeeId }: { channelId: string; employeeId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(async () => {
          await removeVoiceChannelMember(channelId, employeeId);
          router.refresh();
        });
      }}
      className="text-[var(--muted-2)] hover:text-[var(--danger)]"
      title="Remove from channel"
    >
      <X className="h-3 w-3" />
    </button>
  );
}
