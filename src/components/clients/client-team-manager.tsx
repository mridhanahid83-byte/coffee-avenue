"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { assignClientTeamMember, removeClientTeamMember } from "@/lib/actions/clients";
import { X } from "lucide-react";
import { initials } from "@/lib/utils";

type Member = { id: string; role: string; employee: { id: string; fullName: string; email: string } };
type EmployeeOption = { id: string; fullName: string };

const ROLE_LABELS: Record<string, string> = {
  CS: "Client Service",
  DESIGNER: "Designer",
  DIGITAL_MARKETER: "Digital Marketer",
  DEVELOPER: "Developer",
  OTHER: "Other",
};

export function ClientTeamManager({
  clientId,
  members,
  employees,
  canManage,
}: {
  clientId: string;
  members: Member[];
  employees: EmployeeOption[];
  canManage: boolean;
}) {
  const [, formAction, pending] = useActionState(assignClientTeamMember, {});
  const [removing, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      {members.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">No team members assigned to this client yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
                  {initials(m.employee.fullName)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{m.employee.fullName}</p>
                  <p className="text-xs text-[var(--muted)]">{ROLE_LABELS[m.role] ?? m.role}</p>
                </div>
              </div>
              {canManage && (
                <button
                  disabled={removing}
                  onClick={() =>
                    startTransition(async () => {
                      await removeClientTeamMember(m.id, clientId);
                      router.refresh();
                    })
                  }
                  className="text-[var(--muted)] hover:text-[var(--danger)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {canManage && (
        <form action={formAction} className="flex flex-col gap-2 border-t border-[var(--border)] pt-4 sm:flex-row">
          <input type="hidden" name="clientId" value={clientId} />
          <Select name="employeeId" required className="flex-1">
            <option value="">Select employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.fullName}
              </option>
            ))}
          </Select>
          <Select name="role" required className="sm:w-48">
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Button type="submit" disabled={pending} size="sm">
            Assign
          </Button>
        </form>
      )}
    </div>
  );
}
