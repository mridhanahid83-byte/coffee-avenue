import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import type { ClientStatus, Prisma } from "@prisma/client";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; pendingWork?: string; overdueWork?: string }>;
}) {
  const session = await requirePagePermission("clients.view");
  const params = await searchParams;
  const canCreate = hasPermission(session.user.permissions, "clients.create");

  const where: Prisma.ClientWhereInput = {
    ...(params.q
      ? {
          OR: [
            { clientName: { contains: params.q, mode: "insensitive" } },
            { companyName: { contains: params.q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(params.status ? { status: params.status as ClientStatus } : { status: { notIn: ["ARCHIVED"] } }),
    ...(params.pendingWork ? { tasks: { some: { status: { notIn: ["COMPLETED", "CANCELLED"] } } } } : {}),
    ...(params.overdueWork ? { tasks: { some: { deadline: { lt: new Date() }, status: { notIn: ["COMPLETED", "CANCELLED"] } } } } : {}),
  };

  const clients = await prisma.client.findMany({
    where,
    include: { assignedCs: true, _count: { select: { tasks: true } } },
    orderBy: [{ status: "asc" }, { clientName: "asc" }],
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Clients</h1>
          <p className="text-sm text-[var(--muted)]">{clients.length} client{clients.length === 1 ? "" : "s"}</p>
        </div>
        {canCreate && (
          <Link href="/clients/new">
            <Button>
              <Plus className="h-4 w-4" /> Add Client
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <form className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
          <Input name="q" placeholder="Search client or company" defaultValue={params.q} />
          <Select name="status" defaultValue={params.status ?? ""}>
            <option value="">Active pipeline (default)</option>
            <option value="LEAD">Lead</option>
            <option value="PROPOSAL">Proposal</option>
            <option value="ONBOARDING">Onboarding</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="COMPLETED">Completed</option>
            <option value="LOST">Lost</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
          <Button type="submit" variant="secondary" size="sm" className="sm:w-fit">
            Apply filters
          </Button>
        </form>
      </Card>

      {clients.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No active clients yet."
          description="Add your first client to start assigning tasks and tracking delivery."
          actionHref={canCreate ? "/clients/new" : undefined}
          actionLabel={canCreate ? "Add Client" : undefined}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Assigned CS</TableHead>
              <TableHead>Renewal</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Link href={`/clients/${c.id}`}>
                    <p className="font-medium text-[var(--foreground)]">{c.clientName}</p>
                    <p className="text-xs text-[var(--muted)]">{c.companyName ?? ""}</p>
                  </Link>
                </TableCell>
                <TableCell>{c.industry ?? "—"}</TableCell>
                <TableCell>{c.packageName ?? "—"}</TableCell>
                <TableCell>{c.assignedCs?.fullName ?? "—"}</TableCell>
                <TableCell>{formatDate(c.renewalDate)}</TableCell>
                <TableCell>{c._count.tasks}</TableCell>
                <TableCell>
                  <StatusBadge type="clientStatus" value={c.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
