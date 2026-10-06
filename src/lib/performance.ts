import "server-only";
import { prisma } from "@/lib/prisma";
import { getScheduleSettings } from "@/lib/settings";
import { countWorkingDays } from "@/lib/attendance-calc";

export type EmployeePerformance = {
  employeeId: string;
  fullName: string;
  departmentName: string | null;
  assigned: number;
  completed: number;
  pending: number;
  overdue: number;
  onTime: number;
  late: number;
  deliveryRate: number | null;
  onTimeRate: number | null;
  attendanceRate: number | null;
  activeTasks: number;
  dueToday: number;
  dueUpcoming: number;
};

export async function computeEmployeePerformance(options: {
  employeeIds?: string[];
  departmentId?: string;
  monthStart?: Date;
  monthEnd?: Date;
}): Promise<EmployeePerformance[]> {
  const now = new Date();
  const monthStart = options.monthStart ?? new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = options.monthEnd ?? new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const effectiveEnd = monthEnd < now ? monthEnd : now;

  const employees = await prisma.employee.findMany({
    where: {
      status: "ACTIVE",
      ...(options.employeeIds ? { id: { in: options.employeeIds } } : {}),
      ...(options.departmentId ? { departmentId: options.departmentId } : {}),
    },
    include: { department: true },
    orderBy: { fullName: "asc" },
  });

  const schedule = await getScheduleSettings();
  const holidays = await prisma.holiday.findMany({ where: { date: { gte: monthStart, lte: monthEnd } } });
  const holidaySet = new Set(holidays.map((h) => h.date.toISOString().slice(0, 10)));
  const expectedDays = countWorkingDays(monthStart, effectiveEnd, schedule, holidaySet);

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const results: EmployeePerformance[] = [];

  for (const e of employees) {
    const [monthTasks, allOpenTasks, attendanceRecords] = await Promise.all([
      prisma.task.findMany({ where: { assigneeId: e.id, createdAt: { gte: monthStart, lte: monthEnd } } }),
      prisma.task.findMany({ where: { assigneeId: e.id, status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
      prisma.attendance.findMany({ where: { employeeId: e.id, date: { gte: monthStart, lte: monthEnd } } }),
    ]);

    const assigned = monthTasks.length;
    const completed = monthTasks.filter((t) => t.status === "COMPLETED").length;
    const pending = monthTasks.filter((t) => !["COMPLETED", "CANCELLED"].includes(t.status)).length;
    const overdue = allOpenTasks.filter((t) => t.deadline && t.deadline < now).length;
    const onTime = monthTasks.filter((t) => t.status === "COMPLETED" && t.completedAt && t.deadline && t.completedAt <= t.deadline).length;
    const late = monthTasks.filter((t) => t.status === "COMPLETED" && t.completedAt && t.deadline && t.completedAt > t.deadline).length;

    const presentDays = attendanceRecords.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;

    const dueToday = allOpenTasks.filter((t) => t.deadline && t.deadline >= todayStart && t.deadline <= todayEnd).length;
    const dueUpcoming = allOpenTasks.filter((t) => t.deadline && t.deadline > todayEnd).length;

    results.push({
      employeeId: e.id,
      fullName: e.fullName,
      departmentName: e.department?.name ?? null,
      assigned,
      completed,
      pending,
      overdue,
      onTime,
      late,
      deliveryRate: assigned > 0 ? Math.round((completed / assigned) * 100) : null,
      onTimeRate: completed > 0 ? Math.round((onTime / completed) * 100) : null,
      attendanceRate: expectedDays > 0 ? Math.round((presentDays / expectedDays) * 100) : null,
      activeTasks: allOpenTasks.length,
      dueToday,
      dueUpcoming,
    });
  }

  return results;
}
