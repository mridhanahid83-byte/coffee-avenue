"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reviewLeave } from "@/lib/actions/leave";
import { formatDate } from "@/lib/utils";

type LeaveRequest = {
  id: string;
  employeeName: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  reason: string | null;
};

export function LeaveApprovals({ requests }: { requests: LeaveRequest[] }) {
  if (requests.length === 0) {
    return <p className="text-sm text-[var(--muted)]">No pending leave requests.</p>;
  }
  return (
    <ul className="flex flex-col gap-3">
      {requests.map((r) => (
        <LeaveRow key={r.id} request={r} />
      ))}
    </ul>
  );
}

function LeaveRow({ request }: { request: LeaveRequest }) {
  const [pending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [note, setNote] = useState("");
  const router = useRouter();

  function act(decision: "APPROVED" | "REJECTED") {
    startTransition(async () => {
      await reviewLeave(request.id, decision, note || undefined);
      router.refresh();
    });
  }

  return (
    <li className="rounded-lg border border-[var(--border)] p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">{request.employeeName}</p>
          <p className="text-xs text-[var(--muted)]">
            {request.leaveTypeName} · {formatDate(request.startDate)} – {formatDate(request.endDate)}
          </p>
          {request.reason && <p className="mt-1 text-xs text-[var(--muted)]">&ldquo;{request.reason}&rdquo;</p>}
        </div>
        <div className="flex gap-2">
          <Button size="sm" disabled={pending} onClick={() => act("APPROVED")}>
            Approve
          </Button>
          <Button size="sm" variant="outline" disabled={pending} onClick={() => setShowReject((v) => !v)}>
            Reject
          </Button>
        </div>
      </div>
      {showReject && (
        <div className="mt-2 flex gap-2">
          <Textarea placeholder="Reason (optional)" rows={1} value={note} onChange={(e) => setNote(e.target.value)} />
          <Button size="sm" variant="destructive" disabled={pending} onClick={() => act("REJECTED")}>
            Confirm reject
          </Button>
        </div>
      )}
    </li>
  );
}
