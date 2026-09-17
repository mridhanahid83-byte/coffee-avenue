import { notFound } from "next/navigation";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { ContentForm } from "@/components/content/content-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";

export default async function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePagePermission("content.view");
  const { id } = await params;

  const [item, clients, employees] = await Promise.all([
    prisma.contentItem.findUnique({ where: { id }, include: { client: true, assignee: true } }),
    prisma.client.findMany({ where: { status: { notIn: ["ARCHIVED"] } }, orderBy: { clientName: "asc" } }),
    prisma.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" } }),
  ]);
  if (!item) notFound();

  const canManage = hasPermission(session.user.permissions, "content.manage");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">{item.title}</h1>
          <StatusBadge type="contentStage" value={item.stage} />
        </div>
        <p className="text-sm text-[var(--muted)]">
          <Link href={`/clients/${item.client.id}`} className="hover:text-[var(--accent)]">
            {item.client.clientName}
          </Link>{" "}
          · {item.contentType}
        </p>
      </div>

      {canManage ? (
        <ContentForm
          mode="edit"
          clients={clients.map((c) => ({ id: c.id, name: c.clientName }))}
          employees={employees.map((e) => ({ id: e.id, fullName: e.fullName }))}
          initial={{
            id: item.id,
            clientId: item.clientId,
            title: item.title,
            contentType: item.contentType,
            stage: item.stage,
            copyStatus: item.copyStatus,
            designStatus: item.designStatus,
            internalReview: item.internalReview,
            clientApproval: item.clientApproval,
            revisionNotes: item.revisionNotes,
            publishingStatus: item.publishingStatus,
            assigneeId: item.assigneeId,
            deadline: item.deadline ? item.deadline.toISOString().slice(0, 10) : null,
            publishedDate: item.publishedDate ? item.publishedDate.toISOString().slice(0, 10) : null,
          }}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Assigned to" value={item.assignee?.fullName} />
            <Info label="Copy status" value={item.copyStatus} />
            <Info label="Design status" value={item.designStatus} />
            <Info label="Internal review" value={item.internalReview} />
            <Info label="Client approval" value={item.clientApproval} />
            <Info label="Publishing status" value={item.publishingStatus} />
          </CardContent>
        </Card>
      )}
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
