"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createRole, updateRolePermissions, deleteRole, type SimpleFormState } from "@/lib/actions/settings";
import { PERMISSION_GROUPS, WILDCARD } from "@/lib/permissions";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

type Role = { id: string; name: string; isSystem: boolean; permissions: string[]; employeeCount: number };

export function RoleManager({ roles }: { roles: Role[] }) {
  const [createState, createAction, createPending] = useActionState<SimpleFormState, FormData>(createRole, {});
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {roles.map((role) => (
        <RoleRow key={role.id} role={role} expanded={expanded === role.id} onToggle={() => setExpanded(expanded === role.id ? null : role.id)} />
      ))}

      <form action={createAction} className="flex gap-2 border-t border-[var(--border)] pt-4">
        <Input name="name" placeholder="New role name" required className="flex-1" />
        <Button type="submit" disabled={createPending} size="sm">
          Add role
        </Button>
      </form>
      {createState.error && <p className="text-xs text-[var(--danger)]">{createState.error}</p>}
    </div>
  );
}

function RoleRow({ role, expanded, onToggle }: { role: Role; expanded: boolean; onToggle: () => void }) {
  const [selected, setSelected] = useState<string[]>(role.permissions);
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();
  const router = useRouter();
  const isWildcard = selected.includes(WILDCARD);

  function toggle(key: string) {
    setSelected((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));
  }

  function save() {
    startTransition(async () => {
      await updateRolePermissions(role.id, selected);
      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-[var(--border)]">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3">
        <div className="text-left">
          <p className="text-sm font-medium text-[var(--foreground)]">
            {role.name} {role.isSystem && <Badge variant="neutral" className="ml-1">default</Badge>}
          </p>
          <p className="text-xs text-[var(--muted)]">
            {role.employeeCount} employee{role.employeeCount === 1 ? "" : "s"} · {isWildcard ? "Full access" : `${role.permissions.length} permissions`}
          </p>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-[var(--muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--muted)]" />}
      </button>

      {expanded && (
        <div className="border-t border-[var(--border)] p-4">
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <input type="checkbox" checked={isWildcard} onChange={() => setSelected(isWildcard ? [] : [WILDCARD])} className="h-4 w-4 rounded border-[var(--border-strong)]" />
            Full access (Super Admin)
          </label>

          {!isWildcard && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PERMISSION_GROUPS.map((g) => (
                <div key={g.group}>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted-2)]">{g.group}</p>
                  <div className="flex flex-col gap-1">
                    {g.items.map((item) => (
                      <label key={item.key} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                        <input
                          type="checkbox"
                          checked={selected.includes(item.key)}
                          onChange={() => toggle(item.key)}
                          className="h-3.5 w-3.5 rounded border-[var(--border-strong)]"
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-between">
            {!role.isSystem && role.employeeCount === 0 ? (
              <button
                onClick={() => startDelete(async () => {
                  await deleteRole(role.id);
                  router.refresh();
                })}
                disabled={deleting}
                className="flex items-center gap-1 text-xs text-[var(--danger)] hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete role
              </button>
            ) : (
              <span />
            )}
            <Button size="sm" onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save permissions"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
