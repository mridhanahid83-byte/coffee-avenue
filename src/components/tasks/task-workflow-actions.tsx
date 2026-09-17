"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { changeTaskStatus } from "@/lib/actions/tasks";
import type { TaskStatus } from "@prisma/client";

export function TaskWorkflowActions({
  taskId,
  status,
  requiresReview,
  deliveryLink,
  isAssignee,
  canReview,
  canManage,
}: {
  taskId: string;
  status: TaskStatus;
  requiresReview: boolean;
  deliveryLink: string | null;
  isAssignee: boolean;
  canReview: boolean;
  canManage: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [link, setLink] = useState(deliveryLink ?? "");
  const [note, setNote] = useState("");
  const router = useRouter();

  const canActAsOwner = isAssignee || canManage;

  function run(action: Parameters<typeof changeTaskStatus>[1], extra?: { deliveryLink?: string; note?: string }) {
    startTransition(async () => {
      const res = await changeTaskStatus(taskId, action, extra);
      if (res.error) setError(res.error);
      else {
        setError(null);
        setShowSubmitForm(false);
        setShowRevisionForm(false);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {status === "NOT_STARTED" && canActAsOwner && (
          <Button size="sm" disabled={pending} onClick={() => run("start")}>
            Start task
          </Button>
        )}

        {status === "IN_PROGRESS" && canActAsOwner && (
          <>
            <Button size="sm" disabled={pending} onClick={() => setShowSubmitForm((v) => !v)}>
              {requiresReview ? "Submit for review" : "Mark completed"}
            </Button>
            <Button size="sm" variant="outline" disabled={pending} onClick={() => run("wait_client")}>
              Waiting on client
            </Button>
          </>
        )}

        {status === "WAITING_CLIENT" && canActAsOwner && (
          <Button size="sm" disabled={pending} onClick={() => run("resume")}>
            Resume work
          </Button>
        )}

        {status === "REVISION" && canActAsOwner && (
          <Button size="sm" disabled={pending} onClick={() => setShowSubmitForm((v) => !v)}>
            Resubmit
          </Button>
        )}

        {status === "WAITING_REVIEW" && canReview && (
          <>
            <Button size="sm" disabled={pending} onClick={() => run("approve")}>
              Approve
            </Button>
            <Button size="sm" variant="outline" disabled={pending} onClick={() => setShowRevisionForm((v) => !v)}>
              Request revision
            </Button>
          </>
        )}

        {canManage && !["CANCELLED", "COMPLETED"].includes(status) && (
          <Button size="sm" variant="destructive" disabled={pending} onClick={() => run("cancel")}>
            Cancel task
          </Button>
        )}

        {canManage && ["CANCELLED", "COMPLETED"].includes(status) && (
          <Button size="sm" variant="outline" disabled={pending} onClick={() => run("reopen")}>
            Reopen
          </Button>
        )}
      </div>

      {showSubmitForm && (
        <div className="flex flex-col gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3">
          <Input placeholder="Delivery link (optional)" value={link} onChange={(e) => setLink(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setShowSubmitForm(false)}>
              Cancel
            </Button>
            <Button size="sm" disabled={pending} onClick={() => run("submit", { deliveryLink: link })}>
              {requiresReview ? "Submit" : "Complete"}
            </Button>
          </div>
        </div>
      )}

      {showRevisionForm && (
        <div className="flex flex-col gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3">
          <Textarea placeholder="What needs to change?" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setShowRevisionForm(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="destructive" disabled={pending} onClick={() => run("request_revision", { note })}>
              Request revision
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
