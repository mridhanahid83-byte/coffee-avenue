"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createDepartment, deleteDepartment, type SimpleFormState } from "@/lib/actions/settings";
import { Trash2 } from "lucide-react";

type Department = { id: string; name: string; isSystem: boolean; employeeCount: number; taskCount: number };

export function DepartmentManager({ departments }: { departments: Department[] }) {
  const [state, formAction, pending] = useActionState<SimpleFormState, FormData>(createDepartment, {});
  const [, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {departments.map((d) => (
          <li key={d.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">{d.name}</p>
              <p className="text-xs text-[var(--muted)]">
                {d.employeeCount} employees · {d.taskCount} tasks {d.isSystem ? "· default" : ""}
              </p>
            </div>
            {!d.isSystem && d.employeeCount === 0 && d.taskCount === 0 && (
              <button
                onClick={() =>
                  startTransition(async () => {
                    await deleteDepartment(d.id);
                    router.refresh();
                  })
                }
                className="text-[var(--muted)] hover:text-[var(--danger)]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </li>
        ))}
      </ul>

      <form action={formAction} className="flex gap-2 border-t border-[var(--border)] pt-4">
        <Input name="name" placeholder="New department name" required className="flex-1" />
        <Button type="submit" disabled={pending} size="sm">
          Add
        </Button>
      </form>
      {state.error && <p className="text-xs text-[var(--danger)]">{state.error}</p>}
    </div>
  );
}
