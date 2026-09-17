import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { SettingsNav } from "@/components/settings/settings-nav";
import { RoleManager } from "@/components/settings/role-manager";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function RolesSettingsPage() {
  await requirePagePermission("org.manage");

  const roles = await prisma.role.findMany({
    include: { _count: { select: { employees: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">Settings</h1>
        <p className="text-sm text-[var(--muted)]">Configure FameTerra Agency OS without touching any code.</p>
      </div>
      <SettingsNav />
      <div className="max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Roles &amp; Permissions</CardTitle>
            <CardDescription>Every permission check in the app is enforced on the server against these lists.</CardDescription>
          </CardHeader>
          <CardContent>
            <RoleManager
              roles={roles.map((r) => ({
                id: r.id,
                name: r.name,
                isSystem: r.isSystem,
                permissions: r.permissions as string[],
                employeeCount: r._count.employees,
              }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
