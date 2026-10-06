import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { toCsv, csvResponse } from "@/lib/csv";
import { formatDate, formatTime } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.permissions, "reports.view")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const monthStr = req.nextUrl.searchParams.get("month");
  const now = new Date();
  const [year, month] = (monthStr ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`).split("-").map(Number);
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  const records = await prisma.attendance.findMany({
    where: { date: { gte: monthStart, lte: monthEnd } },
    include: { employee: true },
    orderBy: [{ date: "asc" }, { employee: { fullName: "asc" } }],
  });

  const rows = records.map((r) => ({
    employee: r.employee.fullName,
    date: formatDate(r.date),
    checkIn: formatTime(r.checkInAt),
    checkOut: formatTime(r.checkOutAt),
    status: r.status,
    lateMinutes: r.lateMinutes,
  }));

  const csv = toCsv(rows, [
    { key: "employee", label: "Employee" },
    { key: "date", label: "Date" },
    { key: "checkIn", label: "Check-in" },
    { key: "checkOut", label: "Check-out" },
    { key: "status", label: "Status" },
    { key: "lateMinutes", label: "Late (minutes)" },
  ]);

  return csvResponse(`attendance-report-${year}-${String(month).padStart(2, "0")}.csv`, csv);
}
