import Link from "next/link";
import { Plus, FileStack } from "lucide-react";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import type { ContentStage, Prisma } from "@prisma/client";

const STAGES: ContentStage[] = ["BRIEF", "COPY", "DESIGN", "INTERNAL_REVIEW", "CLIENT_APPROVAL", "REVISION", "APPROVED", "PUBLISHED"];

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const session = await requirePagePermission("content.view");
  const params = await searchParams;
  const canManage = hasPermission(session.user.permissions, "content.manage");

  const clients = await prisma.client.findMany({ where: { status: { notIn: ["ARCHIVED"] } }, orderBy: { clientName: "asc" } });

  const where: Prisma.ContentItemWhereInput = params.client ? { clientId: params.client } : {};
  const items = await prisma.contentItem.findMany({
    where,
    include: { client: true, assignee: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Content Delivery</h1>
          <p className="text-sm text-[var(--muted)]">Where every piece of content currently stands</p>
        </div>
        {canManage && (
          <Link href="/content/new">
            <Button>
              <Plus className="h-4 w-4" /> New Content
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <form className="flex flex-wrap items-center gap-3 p-4">
          <Select name="client" defaultValue={params.client ?? ""} className="max-w-xs">
            <option value="">All clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.clientName}
              </option>
            ))}
          </Select>
          <Button type="submit" variant="secondary" size="sm">
            Apply
          </Button>
        </form>
      </Card>

      {items.length === 0 ? (
        <EmptyState
          icon={FileStack}
          title="No content yet"
          description="Content items created for clients will appear here, organized by pipeline stage."
          actionHref={canManage ? "/content/new" : undefined}
          actionLabel={canManage ? "New Content" : undefined}
        />
      ) : (
        <div className="scrollbar-thin flex gap-4 overflow-x-auto pb-2">
          {STAGES.map((stage) => {
            const stageItems = items.filter((i) => i.stage === stage);
            return (
              <div key={stage} className="w-72 shrink-0">
                <div className="mb-2 flex items-center justify-between px-1">
                  <StatusBadge type="contentStage" value={stage} />
                  <span className="text-xs text-[var(--muted-2)]">{stageItems.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {stageItems.map((item) => (
                    <Link key={item.id} href={`/content/${item.id}`}>
                      <Card className="p-3 transition-colors hover:border-[var(--border-strong)]">
                        <p className="text-sm font-medium text-[var(--foreground)]">{item.title}</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">{item.client.clientName} · {item.contentType}</p>
                        <p className="mt-1 text-xs text-[var(--muted-2)]">
                          {item.assignee?.fullName ?? "Unassigned"} {item.deadline ? `· Due ${formatDate(item.deadline)}` : ""}
                        </p>
                      </Card>
                    </Link>
                  ))}
                  {stageItems.length === 0 && <p className="px-1 text-xs text-[var(--muted-2)]">Nothing here</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
