import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";
import { Bell } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function NotificationsPage() {
  const session = await requirePagePermission("notifications.own");

  const notifications = await prisma.notification.findMany({
    where: { employeeId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">Notifications</h1>
        <p className="text-sm text-[var(--muted)]">Everything relevant to you, in one place</p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up." description="New task assignments, deadlines and comments will appear here." />
      ) : (
        <Card>
          <CardContent className="divide-y divide-[var(--border)] p-0">
            {notifications.map((n) => {
              const content = (
                <div className={cn("flex items-start justify-between gap-3 px-5 py-3", !n.isRead && "bg-[var(--accent-soft)]/20")}>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{n.title}</p>
                    <p className="text-sm text-[var(--muted)]">{n.message}</p>
                    <p className="mt-1 text-xs text-[var(--muted-2)]">{formatDateTime(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />}
                </div>
              );
              return n.link ? (
                <Link key={n.id} href={n.link} className="block hover:bg-[var(--surface-hover)]">
                  {content}
                </Link>
              ) : (
                <div key={n.id}>{content}</div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
