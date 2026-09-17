"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addTaskComment } from "@/lib/actions/tasks";

export function TaskCommentForm({ taskId }: { taskId: string }) {
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function submit() {
    if (!body.trim()) return;
    startTransition(async () => {
      const res = await addTaskComment(taskId, body);
      if (res.error) setError(res.error);
      else {
        setBody("");
        setError(null);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea placeholder="Add a comment…" rows={2} value={body} onChange={(e) => setBody(e.target.value)} />
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
      <div className="flex justify-end">
        <Button size="sm" disabled={pending || !body.trim()} onClick={submit}>
          Comment
        </Button>
      </div>
    </div>
  );
}
