import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { getScheduleSettings } from "@/lib/settings";
import { startOfDay, countWorkingDays } from "@/lib/attendance-calc";
import { CheckInCard } from "@/components/attendance/check-in-card";
import { AttendanceCorrectionForm } from "@/components/attendance/attendance-correction-form";
import { LeaveRequestForm } from "@/components/attendance/leave-request-form";
import { LeaveApprovals } from "@/components/attendance/leave-approvals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, formatTime } from "@/lib/utils";
import { Clock } from "lucide-react";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; department?: string; status?: string }>;
}) {
  const session = await requirePagePermission("attendance.own");
  const params = await searchParams;
  const canViewAll = hasPermission(session.user.permissions, "attendance.viewAll");
  const canCorrect = hasPermission(session.user.permissions, "attendance.correct");

  const schedule = await getScheduleSettings();
  const today = startOfDay(new Date());

  const myRecord = await prisma.attendance.findUnique({
    where: { employeeId_date: { employeeId: session.user.id, date: today } },
  });

  const myHistory = await prisma.attendance.findMany({
    where: { employeeId: session.user.id },
    orderBy: { date: "desc" },
    take: 14,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">Attendance</h1>
        <p className="text-sm text-[var(--muted)]">{formatDate(today)}</p>
      </div>

      <CheckInCard
        record={
          myRecord
            ? {
                checkInAt: myRecord.checkInAt?.toISOString() ?? null,
                checkOutAt: myRecord.checkOutAt?.toISOString() ?? null,
                status: myRecord.status,
              }
            : null
        }
        schedule={schedule}
      />

      <Card>
        <CardHeader>
          <CardTitle>My recent attendance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {myHistory.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={Clock} title="No attendance records available." description="Check in to start building your attendance history." />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myHistory.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{formatDate(r.date)}</TableCell>
                    <TableCell>{formatTime(r.checkInAt)}</TableCell>
                    <TableCell>
                      {formatTime(r.checkOutAt)}
                      {!r.checkOutAt && r.checkInAt && startOfDay(r.date) < today && (
                        <Badge variant="warning" className="ml-2">
                          Missing checkout
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge type="attendanceStatus" value={r.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <LeaveCard employeeId={session.user.id} canReview={hasPermission(session.user.permissions, "leave.review")} />

      {canViewAll && (
        <ManagementAttendance params={params} canCorrect={canCorrect} today={today} schedule={schedule} />
      )}
    </div>
  );
}

async function LeaveCard({ employeeId, canReview }: { employeeId: string; canReview: boolean }) {
  const [leaveTypes, myLeaves, pendingLeaves] = await Promise.all([
    prisma.leaveType.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.leave.findMany({ where: { employeeId }, include: { leaveType: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    canReview
      ? prisma.leave.findMany({ where: { status: "PENDING" }, include: { employee: true, leaveType: true }, orderBy: { createdAt: "asc" } })
      : Promise.resolve([]),
  ]);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Leave</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LeaveRequestForm leaveTypes={leaveTypes} />
          {myLeaves.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-[var(--border)] pt-3">
              {myLeaves.map((l) => (
                <div key={l.id} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--foreground)]">
                    {l.leaveType.name} · {formatDate(l.startDate)} – {formatDate(l.endDate)}
                  </span>
                  <StatusBadge type="leaveStatus" value={l.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {canReview && (
        <Card>
          <CardHeader>
            <CardTitle>Leave approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <LeaveApprovals
              requests={pendingLeaves.map((l) => ({
                id: l.id,
                employeeName: l.employee.fullName,
                leaveTypeName: l.leaveType.name,
                startDate: l.startDate.toISOString(),
                endDate: l.endDate.toISOString(),
                reason: l.reason,
              }))}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

async function ManagementAttendance({
  params,
  canCorrect,
  today,
  schedule,
}: {
  params: { month?: string; department?: string; status?: string };
  canCorrect: boolean;
  today: Date;
  schedule: Awaited<ReturnType<typeof getScheduleSettings>>;
}) {
  const departments = await prisma.department.findMany({ orderBy: { name: "asc" } });

  const monthStr = params.month ?? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [year, month] = monthStr.split("-").map(Number);
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);
  const effectiveEnd = monthEnd < today ? monthEnd : today;

  const employees = await prisma.employee.findMany({
    where: { status: "ACTIVE", ...(params.department ? { departmentId: params.department } : {}) },
    include: { department: true },
    orderBy: { fullName: "asc" },
  });

  const holidays = await prisma.holiday.findMany({
    where: { date: { gte: monthStart, lte: monthEnd } },
  });
  const holidaySet = new Set(holidays.map((h) => h.date.toISOString().slice(0, 10)));
  const expectedDays = countWorkingDays(monthStart, effectiveEnd, schedule, holidaySet);

  const records = await prisma.attendance.findMany({
    where: {
      date: { gte: monthStart, lte: monthEnd },
      employeeId: { in: employees.map((e) => e.id) },
    },
  });

  const todayRecords = await prisma.attendance.findMany({
    where: { date: today, employeeId: { in: employees.map((e) => e.id) } },
  });
  const todayByEmployee = new Map(todayRecords.map((r) => [r.employeeId, r]));

  const todayEmployees = params.status
    ? employees.filter((e) => {
        const r = todayByEmployee.get(e.id);
        if (params.status === "ABSENT") return !r;
        return r?.status === params.status;
      })
    : employees;

  const summary = employees.map((e) => {
    const empRecords = records.filter((r) => r.employeeId === e.id);
    const present = empRecords.filter((r) => r.status === "PRESENT").length;
    const late = empRecords.filter((r) => r.status === "LATE").length;
    const absent = empRecords.filter((r) => r.status === "ABSENT").length;
    const leave = empRecords.filter((r) => r.status === "LEAVE").length;
    const attendancePct = expectedDays > 0 ? Math.round(((present + late) / expectedDays) * 100) : null;
    return { employee: e, present, late, absent, leave, attendancePct };
  });

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle>
            Today&apos;s attendance {params.status ? `— filtered to ${params.status.toLowerCase()}` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {todayEmployees.length === 0 ? (
            <EmptyState title="No employees to display" className="m-5" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                  {canCorrect && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayEmployees.map((e) => {
                  const r = todayByEmployee.get(e.id);
                  return (
                    <TableRow key={e.id}>
                      <TableCell>{e.fullName}</TableCell>
                      <TableCell>{e.department?.name ?? "—"}</TableCell>
                      <TableCell>{r ? formatTime(r.checkInAt) : "—"}</TableCell>
                      <TableCell>{r ? formatTime(r.checkOutAt) : "—"}</TableCell>
                      <TableCell>
                        {r ? <StatusBadge type="attendanceStatus" value={r.status} /> : <Badge variant="neutral">Not checked in</Badge>}
                      </TableCell>
                      {canCorrect && (
                        <TableCell className="relative">
                          {r && (
                            <AttendanceCorrectionForm
                              attendanceId={r.id}
                              currentStatus={r.status}
                              checkInTime={r.checkInAt ? r.checkInAt.toTimeString().slice(0, 5) : ""}
                              checkOutTime={r.checkOutAt ? r.checkOutAt.toTimeString().slice(0, 5) : ""}
                            />
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input type="month" name="month" defaultValue={monthStr} className="h-9 rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm text-[var(--foreground)]" />
            <Select name="department" defaultValue={params.department ?? ""}>
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
            <Button type="submit" variant="secondary" size="sm" className="sm:w-fit">
              Apply
            </Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Late</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>Leave</TableHead>
                <TableHead>Attendance %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.map((s) => (
                <TableRow key={s.employee.id}>
                  <TableCell>{s.employee.fullName}</TableCell>
                  <TableCell>{s.present}</TableCell>
                  <TableCell>{s.late}</TableCell>
                  <TableCell>{s.absent}</TableCell>
                  <TableCell>{s.leave}</TableCell>
                  <TableCell>{s.attendancePct !== null ? `${s.attendancePct}%` : "Not enough data"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
