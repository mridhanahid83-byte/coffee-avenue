import { notFound } from "next/navigation";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePagePermission("campaigns.view");
  const { id } = await params;

  const [campaign, clients, employees] = await Promise.all([
    prisma.campaign.findUnique({ where: { id }, include: { client: true, responsible: true } }),
    prisma.client.findMany({ where: { status: { notIn: ["ARCHIVED"] } }, orderBy: { clientName: "asc" } }),
    prisma.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" } }),
  ]);
  if (!campaign) notFound();

  const canManage = hasPermission(session.user.permissions, "campaigns.manage");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">{campaign.name}</h1>
          <StatusBadge type="campaignStatus" value={campaign.status} />
        </div>
        <p className="text-sm text-[var(--muted)]">
          <Link href={`/clients/${campaign.client.id}`} className="hover:text-[var(--accent)]">
            {campaign.client.clientName}
          </Link>
        </p>
      </div>

      {canManage ? (
        <CampaignForm
          mode="edit"
          clients={clients.map((c) => ({ id: c.id, name: c.clientName }))}
          employees={employees.map((e) => ({ id: e.id, fullName: e.fullName }))}
          initial={{
            id: campaign.id,
            clientId: campaign.clientId,
            name: campaign.name,
            platform: campaign.platform,
            objective: campaign.objective,
            budget: campaign.budget ? campaign.budget.toString() : null,
            startDate: campaign.startDate ? campaign.startDate.toISOString().slice(0, 10) : null,
            endDate: campaign.endDate ? campaign.endDate.toISOString().slice(0, 10) : null,
            responsibleId: campaign.responsibleId,
            status: campaign.status,
            notes: campaign.notes,
            reportLink: campaign.reportLink,
          }}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Platform" value={campaign.platform} />
            <Info label="Objective" value={campaign.objective} />
            <Info label="Budget" value={campaign.budget ? `৳${campaign.budget.toString()}` : null} />
            <Info label="Responsible" value={campaign.responsible?.fullName} />
            <Info label="Start date" value={formatDate(campaign.startDate)} />
            <Info label="End date" value={formatDate(campaign.endDate)} />
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
