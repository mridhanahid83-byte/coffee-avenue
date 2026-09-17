import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { SettingsNav } from "@/components/settings/settings-nav";
import { LeaveTypeManager } from "@/components/settings/leave-type-manager";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function LeaveTypesSettingsPage() {
  await requirePagePermission("leave.manageTypes");
  const leaveTypes = await prisma.leaveType.findMany({ orderBy: { name: "asc" } });

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
            <CardTitle>Leave Types</CardTitle>
            <CardDescription>Types available to employees when requesting leave.</CardDescription>
          </CardHeader>
          <CardContent>
            <LeaveTypeManager leaveTypes={leaveTypes} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
