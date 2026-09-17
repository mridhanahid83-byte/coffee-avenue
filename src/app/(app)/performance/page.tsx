import { requirePagePermission } from "@/lib/auth-guard";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { computeEmployeePerformance } from "@/lib/performance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

function Rate({ value }: { value: number | null }) {
  if (value === null) return <span className="text-[var(--muted-2)]">Not enough data</span>;
  const tone = value >= 80 ? "text-[var(--success)]" : value >= 50 ? "text-[var(--warning)]" : "text-[var(--danger)]";
  return <span className={tone}>{value}%</span>;
}

export default async function PerformancePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; department?: string; employee?: string }>;
}) {
  const session = await requirePagePermission("performance.viewOwn");
  const params = await searchParams;
  const canViewAll = hasPermission(session.user.permissions, "performance.viewAll");

  const now = new Date();
  const monthStr = params.month ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [year, month] = monthStr.split("-").map(Number);
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  const departments = canViewAll ? await prisma.department.findMany({ orderBy: { name: "asc" } }) : [];
  const employees = canViewAll ? await prisma.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" } }) : [];

  const performance = await computeEmployeePerformance({
    employeeIds: canViewAll ? (params.employee ? [params.employee] : undefined) : [session.user.id],
    departmentId: canViewAll ? params.department : undefined,
    monthStart,
    monthEnd,
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">Performance</h1>
        <p className="text-sm text-[var(--muted)]">
          {canViewAll ? "Agency-wide performance based on actual task and attendance records" : "Your performance this month"}
        </p>
      </div>

      {canViewAll && (
        <Card>
          <CardContent className="pt-5">
            <form className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <input type="month" name="month" defaultValue={monthStr} className="h-9 rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm text-[var(--foreground)]" />
              <Select name="department" defaultValue={params.department ?? ""}>
                <option value="">All departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
              <Select name="employee" defaultValue={params.employee ?? ""}>
                <option value="">All employees</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName}
                  </option>
                ))}
              </Select>
              <Button type="submit" variant="secondary" size="sm" className="sm:w-fit">
                Apply
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {performance.length === 0 ? (
        <EmptyState title="Not enough data" description="Performance will appear once tasks are assigned and completed." />
      ) : !canViewAll ? (
        <PersonalCard p={performance[0]} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Team performance — {monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Overdue</TableHead>
                  <TableHead>Delivery Rate</TableHead>
                  <TableHead>On-Time Rate</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Workload</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performance.map((p) => (
                  <TableRow key={p.employeeId}>
                    <TableCell>{p.fullName}</TableCell>
                    <TableCell>{p.departmentName ?? "—"}</TableCell>
                    <TableCell>{p.assigned}</TableCell>
                    <TableCell>{p.completed}</TableCell>
                    <TableCell>{p.pending}</TableCell>
                    <TableCell className={p.overdue > 0 ? "text-[var(--danger)]" : undefined}>{p.overdue}</TableCell>
                    <TableCell>
                      <Rate value={p.deliveryRate} />
                    </TableCell>
                    <TableCell>
                      <Rate value={p.onTimeRate} />
                    </TableCell>
                    <TableCell>
                      <Rate value={p.attendanceRate} />
                    </TableCell>
                    <TableCell>{p.activeTasks} active</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PersonalCard({ p }: { p: Awaited<ReturnType<typeof computeEmployeePerformance>>[number] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Metric label="Tasks assigned" value={p.assigned} />
      <Metric label="Completed" value={p.completed} />
      <Metric label="Pending" value={p.pending} />
      <Metric label="Overdue" value={p.overdue} tone={p.overdue > 0 ? "danger" : undefined} />
      <Metric label="Delivery rate" value={p.deliveryRate !== null ? `${p.deliveryRate}%` : "Not enough data"} />
      <Metric label="On-time rate" value={p.onTimeRate !== null ? `${p.onTimeRate}%` : "Not enough data"} />
      <Metric label="Attendance rate" value={p.attendanceRate !== null ? `${p.attendanceRate}%` : "Not enough data"} />
      <Metric label="Current workload" value={`${p.activeTasks} active`} />
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string | number; tone?: "danger" }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-xs text-[var(--muted)]">{label}</p>
        <p className={`mt-1 text-2xl font-semibold ${tone === "danger" ? "text-[var(--danger)]" : "text-[var(--foreground)]"}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
