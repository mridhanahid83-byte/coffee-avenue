"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createTask, updateTaskFields, type TaskFormState } from "@/lib/actions/tasks";

type Option = { id: string; name: string };
type EmployeeOption = { id: string; fullName: string };

const CONTENT_TYPES = ["Static", "Carousel", "Template", "Reel", "Motion", "Story", "Banner", "Other"];

export function TaskForm({
  mode,
  clients,
  departments,
  employees,
  initial,
}: {
  mode: "create" | "edit";
  clients: Option[];
  departments: Option[];
  employees: EmployeeOption[];
  initial?: {
    id: string;
    title: string;
    description: string | null;
    clientId: string | null;
    departmentId: string | null;
    assigneeId: string | null;
    reviewerId: string | null;
    priority: string;
    contentType: string | null;
    brief: string | null;
    referenceLink: string | null;
    startDate: string | null;
    deadline: string | null;
    requiresReview: boolean;
  };
}) {
  const action = mode === "create" ? createTask : updateTaskFields;
  const [state, formAction, pending] = useActionState<TaskFormState, FormData>(action, {});
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.taskId) {
      router.push(`/tasks/${state.taskId}`);
      router.refresh();
    }
  }, [state, router]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="flex flex-col gap-4">
          {initial && <input type="hidden" name="id" value={initial.id} />}

          <div>
            <Label htmlFor="title">Task title</Label>
            <Input id="title" name="title" defaultValue={initial?.title} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} defaultValue={initial?.description ?? ""} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="clientId">Client</Label>
              <Select id="clientId" name="clientId" defaultValue={initial?.clientId ?? ""}>
                <option value="">Internal / no client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="departmentId">Department</Label>
              <Select id="departmentId" name="departmentId" defaultValue={initial?.departmentId ?? ""}>
                <option value="">No department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="assigneeId">Assign to</Label>
              <Select id="assigneeId" name="assigneeId" defaultValue={initial?.assigneeId ?? ""}>
                <option value="">Unassigned</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="reviewerId">Reviewer</Label>
              <Select id="reviewerId" name="reviewerId" defaultValue={initial?.reviewerId ?? ""}>
                <option value="">No reviewer</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select id="priority" name="priority" defaultValue={initial?.priority ?? "MEDIUM"}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="contentType">Content type</Label>
              <Select id="contentType" name="contentType" defaultValue={initial?.contentType ?? ""}>
                <option value="">Not applicable</option>
                {CONTENT_TYPES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">Start date</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={initial?.startDate ?? ""} />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" name="deadline" type="date" defaultValue={initial?.deadline ?? ""} />
            </div>
          </div>

          <div>
            <Label htmlFor="brief">Brief</Label>
            <Textarea id="brief" name="brief" rows={2} defaultValue={initial?.brief ?? ""} />
          </div>
          <div>
            <Label htmlFor="referenceLink">Reference link</Label>
            <Input id="referenceLink" name="referenceLink" defaultValue={initial?.referenceLink ?? ""} placeholder="https://…" />
          </div>

          <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input type="checkbox" name="requiresReview" value="true" defaultChecked={initial?.requiresReview ?? true} className="h-4 w-4 rounded border-[var(--border-strong)]" />
            Requires review before completion
          </label>

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
              {pending ? "Saving…" : mode === "create" ? "Create task" : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
