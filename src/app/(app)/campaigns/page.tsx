import Link from "next/link";
import { Plus, Megaphone } from "lucide-react";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

export default async function CampaignsPage() {
  const session = await requirePagePermission("campaigns.view");
  const canManage = hasPermission(session.user.permissions, "campaigns.manage");

  const campaigns = await prisma.campaign.findMany({
    include: { client: true, responsible: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Campaigns</h1>
          <p className="text-sm text-[var(--muted)]">{campaigns.length} campaign{campaigns.length === 1 ? "" : "s"}</p>
        </div>
        {canManage && (
          <Link href="/campaigns/new">
            <Button>
              <Plus className="h-4 w-4" /> New Campaign
            </Button>
          </Link>
        )}
      </div>

      {campaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          description="Marketing campaigns created for clients will appear here."
          actionHref={canManage ? "/campaigns/new" : undefined}
          actionLabel={canManage ? "New Campaign" : undefined}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Responsible</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Link href={`/campaigns/${c.id}`} className="font-medium text-[var(--foreground)] hover:text-[var(--accent)]">
                    {c.name}
                  </Link>
                </TableCell>
                <TableCell>{c.client.clientName}</TableCell>
                <TableCell>{c.platform ?? "—"}</TableCell>
                <TableCell>{c.responsible?.fullName ?? "—"}</TableCell>
                <TableCell>
                  {formatDate(c.startDate)} – {formatDate(c.endDate)}
                </TableCell>
                <TableCell>
                  <StatusBadge type="campaignStatus" value={c.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
