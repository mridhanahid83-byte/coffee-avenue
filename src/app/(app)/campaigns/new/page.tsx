import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { CampaignForm } from "@/components/campaigns/campaign-form";

export default async function NewCampaignPage() {
  await requirePagePermission("campaigns.manage");
  const [clients, employees] = await Promise.all([
    prisma.client.findMany({ where: { status: { notIn: ["ARCHIVED"] } }, orderBy: { clientName: "asc" } }),
    prisma.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-lg font-semibold text-[var(--foreground)]">New Campaign</h1>
      <p className="mb-6 text-sm text-[var(--muted)]">Track a marketing campaign for a client.</p>
      <CampaignForm
        mode="create"
        clients={clients.map((c) => ({ id: c.id, name: c.clientName }))}
        employees={employees.map((e) => ({ id: e.id, fullName: e.fullName }))}
      />
    </div>
  );
}
