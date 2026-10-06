import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime, initials } from "@/lib/utils";
import { History } from "lucide-react";
import type { Prisma } from "@prisma/client";

const ENTITY_TYPES = ["Employee", "Client", "Task", "ContentItem", "Campaign", "Attendance", "System"];

export default async function ActivityLogPage({
  searchParams,
}: {
  searchParams: Promise<{ entityType?: string; actor?: string }>;
}) {
  await requirePagePermission("activity.view");
  const params = await searchParams;

  const employees = await prisma.employee.findMany({ orderBy: { fullName: "asc" }, select: { id: true, fullName: true } });

  const where: Prisma.ActivityLogWhereInput = {
    ...(params.entityType ? { entityType: params.entityType } : {}),
    ...(params.actor ? { actorId: params.actor } : {}),
  };

  const logs = await prisma.activityLog.findMany({
    where,
    include: { actor: true },
    orderBy: { createdAt: "desc" },
    take: 150,
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">Activity Log</h1>
        <p className="text-sm text-[var(--muted)]">A complete audit trail of actions taken across the agency</p>
      </div>

      <Card>
        <form className="flex flex-wrap items-center gap-3 p-4">
          <Select name="entityType" defaultValue={params.entityType ?? ""} className="max-w-xs">
            <option value="">All entity types</option>
            {ENTITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Select name="actor" defaultValue={params.actor ?? ""} className="max-w-xs">
            <option value="">All users</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.fullName}
              </option>
            ))}
          </Select>
          <Button type="submit" variant="secondary" size="sm">
            Apply
          </Button>
        </form>
      </Card>

      {logs.length === 0 ? (
        <EmptyState icon={History} title="No activity recorded" description="Actions taken across the platform will appear here." />
      ) : (
        <Card>
          <div className="flex flex-col divide-y divide-[var(--border)]">
            {logs.map((l) => (
              <div key={l.id} className="flex items-start gap-3 px-5 py-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[10px] font-semibold text-[var(--accent)]">
                  {l.actor ? initials(l.actor.fullName) : "SYS"}
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)]">{l.description}</p>
                  <p className="text-xs text-[var(--muted-2)]">
                    {formatDateTime(l.createdAt)} · {l.entityType}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
