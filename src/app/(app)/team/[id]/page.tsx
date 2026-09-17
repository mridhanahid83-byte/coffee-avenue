import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmployeeStatusActions } from "@/components/team/employee-status-actions";
import { initials, formatDate, formatDateTime } from "@/lib/utils";
import { Pencil, Mail, Phone, Calendar } from "lucide-react";

export default async function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePagePermission("employees.view");
  const { id } = await params;

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: { role: true, department: true, manager: true, teamLead: true },
  });
  if (!employee) notFound();

  const [taskStats, recentActivity] = await Promise.all([
    prisma.task.groupBy({
      by: ["status"],
      where: { assigneeId: id },
      _count: true,
    }),
    prisma.activityLog.findMany({
      where: { OR: [{ actorId: id }, { entityType: "Employee", entityId: id }] },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const canEdit = hasPermission(session.user.permissions, "employees.edit");
  const canChangeStatus = hasPermission(session.user.permissions, "employees.changeStatus");
  const canResetPassword = hasPermission(session.user.permissions, "employees.resetPassword");

  const totalTasks = taskStats.reduce((s, t) => s + t._count, 0);
  const completedTasks = taskStats.find((t) => t.status === "COMPLETED")?._count ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-soft)] text-lg font-semibold text-[var(--accent)]">
            {initials(employee.fullName)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-[var(--foreground)]">{employee.fullName}</h1>
              <StatusBadge type="employeeStatus" value={employee.status} />
            </div>
            <p className="text-sm text-[var(--muted)]">
              {employee.role.name}
              {employee.department ? ` · ${employee.department.name}` : ""}
            </p>
          </div>
        </div>
        {canEdit && (
          <Link href={`/team/${employee.id}/edit`}>
            <Button variant="secondary">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Employee details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <Detail icon={Mail} label="Email" value={employee.email} />
              <Detail icon={Phone} label="Phone" value={employee.phone ?? "—"} />
              <Detail icon={Calendar} label="Joining date" value={formatDate(employee.joiningDate)} />
              <Detail label="Employee type" value={<StatusBadge type="employeeType" value={employee.employeeType} />} />
              <Detail label="Manager" value={employee.manager?.fullName ?? "—"} />
              <Detail label="Team lead" value={employee.teamLead?.fullName ?? "—"} />
            </CardContent>
          </Card>

          {employee.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[var(--foreground)]">{employee.notes}</CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No activity recorded yet.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {recentActivity.map((a) => (
                    <li key={a.id} className="text-sm">
                      <p className="text-[var(--foreground)]">{a.description}</p>
                      <p className="text-xs text-[var(--muted-2)]">{formatDateTime(a.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          {(canChangeStatus || canResetPassword) && (
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent>
                <EmployeeStatusActions
                  employeeId={employee.id}
                  status={employee.status}
                  canChangeStatus={canChangeStatus}
                  canResetPassword={canResetPassword}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Task snapshot</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-xl font-semibold text-[var(--foreground)]">{totalTasks}</p>
                <p className="text-xs text-[var(--muted)]">Assigned</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-[var(--success)]">{completedTasks}</p>
                <p className="text-xs text-[var(--muted)]">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1.5 text-xs text-[var(--muted)]">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </p>
      <div className="text-[var(--foreground)]">{value}</div>
    </div>
  );
}
