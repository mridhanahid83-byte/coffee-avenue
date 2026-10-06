import { requirePagePermission } from "@/lib/auth-guard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download } from "lucide-react";

const now = new Date();
const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

const REPORTS = [
  { title: "Tasks report", description: "All tasks with client, assignee, status and deadline.", href: "/api/reports/tasks" },
  { title: "Attendance report", description: `Attendance records for ${monthStr}.`, href: `/api/reports/attendance?month=${monthStr}` },
  { title: "Performance report", description: `Delivery, on-time and attendance rates for ${monthStr}.`, href: `/api/reports/performance?month=${monthStr}` },
  { title: "Clients report", description: "All clients with engagement and status.", href: "/api/reports/clients" },
];

export default async function ReportsPage() {
  await requirePagePermission("reports.view");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">Reports</h1>
        <p className="text-sm text-[var(--muted)]">Export operational data as CSV for further analysis.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {REPORTS.map((r) => (
          <Card key={r.title}>
            <CardHeader>
              <CardTitle>{r.title}</CardTitle>
              <CardDescription>{r.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={r.href}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-medium text-[var(--accent-foreground)] hover:opacity-90"
              >
                <Download className="h-4 w-4" /> Download CSV
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
