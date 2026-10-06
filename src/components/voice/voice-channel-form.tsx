"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createVoiceChannel, type VoiceFormState } from "@/lib/actions/voice";
import { Plus } from "lucide-react";

export function VoiceChannelForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<VoiceFormState, FormData>(createVoiceChannel, {});
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hide the form after a successful submission
      setOpen(false);
      router.refresh();
    }
  }, [state.success, router]);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> New Voice Channel
      </Button>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-start gap-2">
      <Input name="name" placeholder="Channel name (e.g. Daily Standup)" required className="w-56" />
      <Input name="description" placeholder="Description (optional)" className="w-56" />
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Creating…" : "Create"}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      {state.error && <p className="w-full text-xs text-[var(--danger)]">{state.error}</p>}
    </form>
  );
}
