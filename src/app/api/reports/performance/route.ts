import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { computeEmployeePerformance } from "@/lib/performance";
import { toCsv, csvResponse } from "@/lib/csv";

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

  const performance = await computeEmployeePerformance({ monthStart, monthEnd });

  const rows = performance.map((p) => ({
    employee: p.fullName,
    department: p.departmentName ?? "",
    assigned: p.assigned,
    completed: p.completed,
    pending: p.pending,
    overdue: p.overdue,
    deliveryRate: p.deliveryRate ?? "N/A",
    onTimeRate: p.onTimeRate ?? "N/A",
    attendanceRate: p.attendanceRate ?? "N/A",
  }));

  const csv = toCsv(rows, [
    { key: "employee", label: "Employee" },
    { key: "department", label: "Department" },
    { key: "assigned", label: "Assigned" },
    { key: "completed", label: "Completed" },
    { key: "pending", label: "Pending" },
    { key: "overdue", label: "Overdue" },
    { key: "deliveryRate", label: "Delivery Rate %" },
    { key: "onTimeRate", label: "On-Time Rate %" },
    { key: "attendanceRate", label: "Attendance Rate %" },
  ]);

  return csvResponse(`performance-report-${year}-${String(month).padStart(2, "0")}.csv`, csv);
}
