import Link from "next/link";
import { requireSession } from "@/lib/auth-guard";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/attendance-calc";
import { getScheduleSettings } from "@/lib/settings";
import { CheckInCard } from "@/components/attendance/check-in-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Users2, UserCheck, UserX, CalendarClock, ListChecks, CheckCircle2, Clock3, AlertTriangle, Building2 } from "lucide-react";

export default async function DashboardPage() {
  const session = await requireSession();
  const canViewAgency = hasPermission(session.user.permissions, "dashboard.view.agency");

  return canViewAgency ? <AgencyDashboard name={session.user.name ?? ""} /> : <PersonalDashboard employeeId={session.user.id} name={session.user.name ?? ""} />;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

async function PersonalDashboard({ employeeId, name }: { employeeId: string; name: string }) {
  const schedule = await getScheduleSettings();
  const today = startOfDay(new Date());
  const now = new Date();
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const [myRecord, tasks, notifications, recentActivity] = await Promise.all([
    prisma.attendance.findUnique({ where: { employeeId_date: { employeeId, date: today } } }),
    prisma.task.findMany({ where: { assigneeId: employeeId, status: { notIn: ["CANCELLED"] } }, include: { client: true }, orderBy: { deadline: "asc" } }),
    prisma.notification.findMany({ where: { employeeId }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.activityLog.findMany({ where: { actorId: employeeId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const overdue = tasks.filter((t) => t.status !== "COMPLETED" && t.deadline && t.deadline < today);
  const todayTasks = tasks.filter((t) => t.status !== "COMPLETED" && t.deadline && t.deadline >= today && t.deadline <= todayEnd);
  const upcoming = tasks.filter((t) => t.status !== "COMPLETED" && (!t.deadline || t.deadline > todayEnd));
  const completed = tasks.filter((t) => t.status === "COMPLETED").slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">
          {greeting()}, {name.split(" ")[0]}
        </h1>
        <p className="text-sm text-[var(--muted)]">{formatDate(new Date())}</p>
      </div>

      <CheckInCard
        record={
          myRecord
            ? { checkInAt: myRecord.checkInAt?.toISOString() ?? null, checkOutAt: myRecord.checkOutAt?.toISOString() ?? null, status: myRecord.status }
            : null
        }
        schedule={schedule}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Overdue" value={overdue.length} href="/tasks" tone="danger" icon={AlertTriangle} />
        <StatCard label="Today" value={todayTasks.length} href="/tasks" tone="accent" icon={Clock3} />
        <StatCard label="Upcoming" value={upcoming.length} href="/tasks" icon={ListChecks} />
        <StatCard label="Completed" value={tasks.filter((t) => t.status === "COMPLETED").length} href="/tasks" tone="success" icon={CheckCircle2} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent notifications</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">You&apos;re all caught up.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="text-sm">
                  <p className="text-[var(--foreground)]">{n.title}</p>
                  <p className="text-xs text-[var(--muted)]">{n.message}</p>
                </div>
              ))
            )}
            <Link href="/notifications" className="text-xs text-[var(--accent)] hover:underline">
              View all notifications
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No recent activity.</p>
            ) : (
              recentActivity.map((a) => (
                <div key={a.id} className="text-sm">
                  <p className="text-[var(--foreground)]">{a.description}</p>
                  <p className="text-xs text-[var(--muted-2)]">{formatDateTime(a.createdAt)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {completed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently completed</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {completed.map((t) => (
              <Link key={t.id} href={`/tasks/${t.id}`} className="flex items-center justify-between text-sm hover:text-[var(--accent)]">
                <span className="text-[var(--foreground)]">{t.title}</span>
                <span className="text-xs text-[var(--muted)]">{t.client?.clientName ?? "Internal"}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

async function AgencyDashboard({ name }: { name: string }) {
  const now = new Date();
  const today = startOfDay(now);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const tomorrowStart = new Date(today);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const tomorrowEnd = new Date(todayEnd);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
  const weekEnd = new Date(todayEnd);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const [
    totalEmployees,
    todayAttendance,
    dueToday,
    completedToday,
    pending,
    overdueTasks,
    activeClients,
    clientsPendingWork,
    clientsOverdueWork,
    dueTomorrowCount,
    dueThisWeekCount,
    departments,
  ] = await Promise.all([
    prisma.employee.count({ where: { status: "ACTIVE" } }),
    prisma.attendance.findMany({ where: { date: today } }),
    prisma.task.count({ where: { deadline: { gte: today, lte: todayEnd }, status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    prisma.task.count({ where: { status: "COMPLETED", completedAt: { gte: today, lte: todayEnd } } }),
    prisma.task.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    prisma.task.count({ where: { deadline: { lt: today }, status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    prisma.client.count({ where: { status: "ACTIVE" } }),
    prisma.client.count({ where: { tasks: { some: { status: { notIn: ["COMPLETED", "CANCELLED"] } } } } }),
    prisma.client.count({ where: { tasks: { some: { deadline: { lt: today }, status: { notIn: ["COMPLETED", "CANCELLED"] } } } } }),
    prisma.task.count({ where: { deadline: { gte: tomorrowStart, lte: tomorrowEnd }, status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    prisma.task.count({ where: { deadline: { gte: today, lte: weekEnd }, status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    prisma.department.findMany({ orderBy: { name: "asc" } }),
  ]);

  const present = todayAttendance.filter((a) => a.status === "PRESENT").length;
  const late = todayAttendance.filter((a) => a.status === "LATE").length;
  const onLeave = todayAttendance.filter((a) => a.status === "LEAVE").length;
  const absent = totalEmployees - todayAttendance.length;

  const deptPerformance = await Promise.all(
    departments.map(async (d) => {
      const [assigned, completed] = await Promise.all([
        prisma.task.count({ where: { departmentId: d.id } }),
        prisma.task.count({ where: { departmentId: d.id, status: "COMPLETED" } }),
      ]);
      return { name: d.name, assigned, completed, rate: assigned > 0 ? Math.round((completed / assigned) * 100) : null };
    })
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">
          {greeting()}, {name.split(" ")[0]}
        </h1>
        <p className="text-sm text-[var(--muted)]">{formatDate(now)} — here&apos;s how FameTerra is doing today</p>
      </div>

      <Section title="Today">
        <StatCard label="Total Employees" value={totalEmployees} href="/team" icon={Users2} />
        <StatCard label="Present" value={present} href="/attendance?status=PRESENT" tone="success" icon={UserCheck} />
        <StatCard label="Late" value={late} href="/attendance?status=LATE" tone="warning" icon={Clock3} />
        <StatCard label="Absent" value={Math.max(absent - onLeave, 0)} href="/attendance?status=ABSENT" tone="danger" icon={UserX} />
        <StatCard label="On Leave" value={onLeave} href="/attendance?status=LEAVE" icon={CalendarClock} />
      </Section>

      <Section title="Tasks">
        <StatCard label="Due Today" value={dueToday} href="/tasks/board?dueToday=1" tone="accent" icon={Clock3} />
        <StatCard label="Completed Today" value={completedToday} href="/tasks/board?completedToday=1" tone="success" icon={CheckCircle2} />
        <StatCard label="Pending" value={pending} href="/tasks/board" icon={ListChecks} />
        <StatCard label="Overdue" value={overdueTasks} href="/tasks/board?overdue=1" tone="danger" icon={AlertTriangle} />
      </Section>

      <Section title="Clients">
        <StatCard label="Active Clients" value={activeClients} href="/clients?status=ACTIVE" icon={Building2} />
        <StatCard label="Pending Work" value={clientsPendingWork} href="/clients?pendingWork=1" tone="warning" icon={Clock3} />
        <StatCard label="Overdue Work" value={clientsOverdueWork} href="/clients?overdueWork=1" tone="danger" icon={AlertTriangle} />
      </Section>

      <Section title="Deadlines">
        <StatCard label="Due Today" value={dueToday} href="/tasks/board?dueToday=1" icon={Clock3} />
        <StatCard label="Due Tomorrow" value={dueTomorrowCount} href="/tasks/board?dueTomorrow=1" icon={Clock3} />
        <StatCard label="Due This Week" value={dueThisWeekCount} href="/tasks/board?dueThisWeek=1" icon={CalendarClock} />
        <StatCard label="Overdue" value={overdueTasks} href="/tasks/board?overdue=1" tone="danger" icon={AlertTriangle} />
      </Section>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Team &amp; department performance</CardTitle>
          <Link href="/performance" className="text-xs text-[var(--accent)] hover:underline">
            Full performance dashboard
          </Link>
        </CardHeader>
        <CardContent>
          {deptPerformance.length === 0 ? (
            <EmptyState title="No departments configured" />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {deptPerformance.map((d) => (
                <div key={d.name} className="rounded-lg border border-[var(--border)] p-3">
                  <p className="text-sm font-medium text-[var(--foreground)]">{d.name}</p>
                  <p className="mt-1 text-xl font-semibold text-[var(--foreground)]">
                    {d.rate !== null ? `${d.rate}%` : <span className="text-sm text-[var(--muted-2)]">Not enough data</span>}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{d.completed}/{d.assigned} tasks completed</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted-2)]">{title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{children}</div>
    </div>
  );
}
