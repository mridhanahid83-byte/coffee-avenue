import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { SettingsNav } from "@/components/settings/settings-nav";
import { DepartmentManager } from "@/components/settings/department-manager";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function DepartmentsSettingsPage() {
  await requirePagePermission("org.manage");

  const departments = await prisma.department.findMany({
    include: { _count: { select: { employees: true, tasks: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">Settings</h1>
        <p className="text-sm text-[var(--muted)]">Configure FameTerra Agency OS without touching any code.</p>
      </div>
      <SettingsNav />
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
            <CardDescription>New departments become instantly available across employees, tasks and boards.</CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentManager
              departments={departments.map((d) => ({
                id: d.id,
                name: d.name,
                isSystem: d.isSystem,
                employeeCount: d._count.employees,
                taskCount: d._count.tasks,
              }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
