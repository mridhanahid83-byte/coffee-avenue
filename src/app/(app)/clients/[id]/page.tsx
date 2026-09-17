import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ClientTabs } from "@/components/clients/client-tabs";
import { ClientTeamManager } from "@/components/clients/client-team-manager";
import { ClientStatusActions } from "@/components/clients/client-status-actions";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Pencil, ListChecks, FileStack, Megaphone } from "lucide-react";

export default async function ClientProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await requirePagePermission("clients.view");
  const { id } = await params;
  const { tab = "overview" } = await searchParams;

  const client = await prisma.client.findUnique({
    where: { id },
    include: { assignedCs: true },
  });
  if (!client) notFound();

  const canEdit = hasPermission(session.user.permissions, "clients.edit");
  const canManageStatus = hasPermission(session.user.permissions, "clients.manageStatus");
  const canAssignTeam = hasPermission(session.user.permissions, "clients.assignTeam");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">{client.clientName}</h1>
            <StatusBadge type="clientStatus" value={client.status} />
          </div>
          <p className="text-sm text-[var(--muted)]">
            {client.companyName ?? client.industry ?? "—"}
            {client.assignedCs ? ` · CS: ${client.assignedCs.fullName}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {canManageStatus && <ClientStatusActions clientId={client.id} status={client.status} />}
          {canEdit && (
            <Link href={`/clients/${client.id}/edit`}>
              <Button variant="secondary">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            </Link>
          )}
        </div>
      </div>

      <ClientTabs clientId={client.id} active={tab} />

      {tab === "overview" && <OverviewTab client={client} />}
      {tab === "team" && (
        <TeamTab clientId={client.id} canAssignTeam={canAssignTeam} />
      )}
      {tab === "tasks" && <TasksTab clientId={client.id} />}
      {tab === "content" && <ContentTab clientId={client.id} />}
      {tab === "campaigns" && <CampaignsTab clientId={client.id} />}
      {tab === "deadlines" && <DeadlinesTab clientId={client.id} />}
      {tab === "performance" && <PerformanceTab clientId={client.id} />}
      {tab === "notes" && <NotesTab notes={client.notes} />}
      {tab === "activity" && <ActivityTab clientId={client.id} />}
    </div>
  );
}

async function OverviewTab({
  client,
}: {
  client: NonNullable<Awaited<ReturnType<typeof prisma.client.findUnique>>>;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <Info label="Contact person" value={client.contactPerson} />
          <Info label="Phone" value={client.phone} />
          <Info label="Email" value={client.email} />
          <Info label="Website" value={client.website} />
          <Info label="Facebook" value={client.facebook} />
          <Info label="Instagram" value={client.instagram} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Engagement</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <Info label="Package" value={client.packageName} />
          <Info label="Monthly fee" value={client.monthlyFee ? `৳${client.monthlyFee.toString()}` : null} />
          <Info label="Start date" value={formatDate(client.startDate)} />
          <Info label="Renewal date" value={formatDate(client.renewalDate)} />
          <Info label="Industry" value={client.industry} />
          <Info label="Services" value={client.services} />
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="text-[var(--foreground)]">{value || "—"}</p>
    </div>
  );
}

async function TeamTab({ clientId, canAssignTeam }: { clientId: string; canAssignTeam: boolean }) {
  const [members, employees] = await Promise.all([
    prisma.clientTeam.findMany({ where: { clientId }, include: { employee: true }, orderBy: { createdAt: "asc" } }),
    prisma.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" }, select: { id: true, fullName: true } }),
  ]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned team</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientTeamManager clientId={clientId} members={members} employees={employees} canManage={canAssignTeam} />
      </CardContent>
    </Card>
  );
}

async function TasksTab({ clientId }: { clientId: string }) {
  const tasks = await prisma.task.findMany({
    where: { clientId },
    include: { assignee: true },
    orderBy: { createdAt: "desc" },
  });
  if (tasks.length === 0) {
    return <EmptyState icon={ListChecks} title="No tasks yet" description="Tasks created for this client will appear here." />;
  }
  return (
    <Card>
      <CardContent className="divide-y divide-[var(--border)] p-0">
        {tasks.map((t) => (
          <Link key={t.id} href={`/tasks/${t.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-[var(--surface-hover)]">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">{t.title}</p>
              <p className="text-xs text-[var(--muted)]">{t.assignee?.fullName ?? "Unassigned"} · Due {formatDate(t.deadline)}</p>
            </div>
            <div className="flex gap-2">
              <StatusBadge type="taskPriority" value={t.priority} />
              <StatusBadge type="taskStatus" value={t.status} />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

async function ContentTab({ clientId }: { clientId: string }) {
  const items = await prisma.contentItem.findMany({ where: { clientId }, include: { assignee: true }, orderBy: { createdAt: "desc" } });
  if (items.length === 0) {
    return <EmptyState icon={FileStack} title="No content yet" description="Content items created for this client will appear here." />;
  }
  return (
    <Card>
      <CardContent className="divide-y divide-[var(--border)] p-0">
        {items.map((c) => (
          <Link key={c.id} href={`/content/${c.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-[var(--surface-hover)]">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">{c.title}</p>
              <p className="text-xs text-[var(--muted)]">{c.contentType} · {c.assignee?.fullName ?? "Unassigned"}</p>
            </div>
            <StatusBadge type="contentStage" value={c.stage} />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

async function CampaignsTab({ clientId }: { clientId: string }) {
  const campaigns = await prisma.campaign.findMany({ where: { clientId }, include: { responsible: true }, orderBy: { createdAt: "desc" } });
  if (campaigns.length === 0) {
    return <EmptyState icon={Megaphone} title="No campaigns yet" description="Marketing campaigns for this client will appear here." />;
  }
  return (
    <Card>
      <CardContent className="divide-y divide-[var(--border)] p-0">
        {campaigns.map((c) => (
          <Link key={c.id} href={`/campaigns/${c.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-[var(--surface-hover)]">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">{c.name}</p>
              <p className="text-xs text-[var(--muted)]">{c.platform ?? "—"} · {c.responsible?.fullName ?? "Unassigned"}</p>
            </div>
            <StatusBadge type="campaignStatus" value={c.status} />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

async function DeadlinesTab({ clientId }: { clientId: string }) {
  const now = new Date();
  const tasks = await prisma.task.findMany({
    where: { clientId, deadline: { not: null }, status: { notIn: ["COMPLETED", "CANCELLED"] } },
    include: { assignee: true },
    orderBy: { deadline: "asc" },
  });
  if (tasks.length === 0) {
    return <EmptyState title="No upcoming deadlines" description="This client has no open tasks with deadlines." />;
  }
  return (
    <Card>
      <CardContent className="divide-y divide-[var(--border)] p-0">
        {tasks.map((t) => {
          const overdue = t.deadline && t.deadline < now;
          return (
            <Link key={t.id} href={`/tasks/${t.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-[var(--surface-hover)]">
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{t.title}</p>
                <p className="text-xs text-[var(--muted)]">{t.assignee?.fullName ?? "Unassigned"}</p>
              </div>
              <p className={overdue ? "text-sm font-medium text-[var(--danger)]" : "text-sm text-[var(--foreground)]"}>
                {formatDate(t.deadline)} {overdue ? "(Overdue)" : ""}
              </p>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

async function PerformanceTab({ clientId }: { clientId: string }) {
  const tasks = await prisma.task.findMany({ where: { clientId } });
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const onTime = tasks.filter((t) => t.status === "COMPLETED" && t.completedAt && t.deadline && t.completedAt <= t.deadline).length;

  const deliveryRate = total > 0 ? Math.round((completed / total) * 100) : null;
  const onTimeRate = completed > 0 ? Math.round((onTime / completed) * 100) : null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <MetricCard label="Delivery rate" value={deliveryRate !== null ? `${deliveryRate}%` : "Not enough data"} sub={`${completed}/${total} tasks completed`} />
      <MetricCard label="On-time rate" value={onTimeRate !== null ? `${onTimeRate}%` : "Not enough data"} sub={`${onTime}/${completed} delivered on time`} />
      <MetricCard label="Open tasks" value={String(tasks.filter((t) => !["COMPLETED", "CANCELLED"].includes(t.status)).length)} />
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-xs text-[var(--muted)]">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-[var(--muted-2)]">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function NotesTab({ notes }: { notes: string | null }) {
  return (
    <Card>
      <CardContent className="pt-5 text-sm text-[var(--foreground)] whitespace-pre-wrap">
        {notes || "No internal notes have been added for this client yet."}
      </CardContent>
    </Card>
  );
}

async function ActivityTab({ clientId }: { clientId: string }) {
  const logs = await prisma.activityLog.findMany({
    where: { entityType: "Client", entityId: clientId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  if (logs.length === 0) {
    return <EmptyState title="No activity recorded" description="Actions taken on this client will be logged here." />;
  }
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-5">
        {logs.map((l) => (
          <div key={l.id} className="text-sm">
            <p className="text-[var(--foreground)]">{l.description}</p>
            <p className="text-xs text-[var(--muted-2)]">{formatDateTime(l.createdAt)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
