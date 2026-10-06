"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { changeEmployeeStatus, resetEmployeePassword } from "@/lib/actions/employees";
import { Copy } from "lucide-react";

export function EmployeeStatusActions({
  employeeId,
  status,
  canChangeStatus,
  canResetPassword,
}: {
  employeeId: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  canChangeStatus: boolean;
  canResetPassword: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const router = useRouter();

  function handleStatus(next: "ACTIVE" | "INACTIVE" | "SUSPENDED") {
    startTransition(async () => {
      await changeEmployeeStatus(employeeId, next);
      router.refresh();
    });
  }

  function handleReset() {
    startTransition(async () => {
      const { tempPassword } = await resetEmployeePassword(employeeId);
      setTempPassword(tempPassword);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {canChangeStatus && status !== "ACTIVE" && (
          <Button size="sm" disabled={pending} onClick={() => handleStatus("ACTIVE")}>
            {status === "INACTIVE" ? "Reactivate" : "Reinstate"}
          </Button>
        )}
        {canChangeStatus && status === "ACTIVE" && (
          <Button size="sm" variant="outline" disabled={pending} onClick={() => handleStatus("INACTIVE")}>
            Deactivate
          </Button>
        )}
        {canChangeStatus && status !== "SUSPENDED" && (
          <Button size="sm" variant="destructive" disabled={pending} onClick={() => handleStatus("SUSPENDED")}>
            Suspend
          </Button>
        )}
        {canResetPassword && (
          <Button size="sm" variant="secondary" disabled={pending} onClick={handleReset}>
            Issue temporary password
          </Button>
        )}
      </div>
      {tempPassword && (
        <div className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs">
          <span className="text-[var(--muted)]">New temporary password:</span>
          <span className="font-mono text-[var(--foreground)]">{tempPassword}</span>
          <button onClick={() => navigator.clipboard.writeText(tempPassword)} className="text-[var(--muted)] hover:text-[var(--foreground)]">
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
