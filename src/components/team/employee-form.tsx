"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createEmployee, updateEmployee, type EmployeeFormState } from "@/lib/actions/employees";
import { Copy, CheckCircle2 } from "lucide-react";

type Role = { id: string; name: string };
type Department = { id: string; name: string };
type EmployeeOption = { id: string; fullName: string };

const EMPLOYEE_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "INTERN", label: "Intern" },
  { value: "FREELANCER", label: "Freelancer" },
  { value: "OTHER", label: "Other" },
];

export function EmployeeForm({
  mode,
  roles,
  departments,
  employees,
  canChangeRole,
  initial,
}: {
  mode: "create" | "edit";
  roles: Role[];
  departments: Department[];
  employees: EmployeeOption[];
  canChangeRole: boolean;
  initial?: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    roleId: string;
    departmentId: string | null;
    employeeType: string;
    joiningDate: string | null;
    managerId: string | null;
    teamLeadId: string | null;
    notes: string | null;
  };
}) {
  const action = mode === "create" ? createEmployee : updateEmployee;
  const [state, formAction, pending] = useActionState<EmployeeFormState, FormData>(action, {});
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  if (state.success && mode === "create" && state.tempPassword) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-[var(--success)]" />
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">Employee account created</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Share this temporary password with the employee. They will be required to change it on first login.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 font-mono text-sm text-[var(--foreground)]">
            {state.tempPassword}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(state.tempPassword ?? "");
                setCopied(true);
              }}
              className="text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
          {copied && <p className="text-xs text-[var(--success)]">Copied to clipboard</p>}
          <div className="mt-2 flex gap-2">
            <Button variant="secondary" onClick={() => router.push(`/team/${state.employeeId}`)}>
              View profile
            </Button>
            <Button onClick={() => router.push("/team")}>Back to Team</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.success && mode === "edit") {
    router.push(`/team/${initial?.id}`);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="flex flex-col gap-4">
          {initial && <input type="hidden" name="id" value={initial.id} />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" defaultValue={initial?.fullName} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={initial?.email} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={initial?.phone ?? ""} />
            </div>
            <div>
              <Label htmlFor="employeeType">Employee type</Label>
              <Select id="employeeType" name="employeeType" defaultValue={initial?.employeeType ?? "FULL_TIME"}>
                {EMPLOYEE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="roleId">Role</Label>
              <Select id="roleId" name="roleId" defaultValue={initial?.roleId} disabled={!canChangeRole} required>
                <option value="" disabled>
                  Select role
                </option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="departmentId">Department</Label>
              <Select id="departmentId" name="departmentId" defaultValue={initial?.departmentId ?? ""} disabled={!canChangeRole}>
                <option value="">No department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="joiningDate">Joining date</Label>
              <Input id="joiningDate" name="joiningDate" type="date" defaultValue={initial?.joiningDate ?? ""} />
            </div>
            <div>
              <Label htmlFor="managerId">Manager</Label>
              <Select id="managerId" name="managerId" defaultValue={initial?.managerId ?? ""}>
                <option value="">No manager</option>
                {employees
                  .filter((e) => e.id !== initial?.id)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName}
                    </option>
                  ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="teamLeadId">Team lead</Label>
              <Select id="teamLeadId" name="teamLeadId" defaultValue={initial?.teamLeadId ?? ""}>
                <option value="">No team lead</option>
                {employees
                  .filter((e) => e.id !== initial?.id)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName}
                    </option>
                  ))}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" rows={3} defaultValue={initial?.notes ?? ""} placeholder="Internal notes about this employee" />
          </div>

          {state.error && (
            <p className="rounded-md border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2 text-xs text-[var(--danger)]">
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : mode === "create" ? "Create employee" : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
