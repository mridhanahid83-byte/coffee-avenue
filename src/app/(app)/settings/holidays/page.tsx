import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { SettingsNav } from "@/components/settings/settings-nav";
import { HolidayManager } from "@/components/settings/holiday-manager";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function HolidaysSettingsPage() {
  await requirePagePermission("leave.manageTypes");
  const holidays = await prisma.holiday.findMany({ orderBy: { date: "asc" } });

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
            <CardTitle>Holidays</CardTitle>
            <CardDescription>Holidays are excluded from expected working days in attendance calculations.</CardDescription>
          </CardHeader>
          <CardContent>
            <HolidayManager holidays={holidays.map((h) => ({ id: h.id, name: h.name, date: h.date.toISOString() }))} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
