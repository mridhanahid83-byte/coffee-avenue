import { requirePagePermission } from "@/lib/auth-guard";
import { getScheduleSettings } from "@/lib/settings";
import { SettingsNav } from "@/components/settings/settings-nav";
import { ScheduleForm } from "@/components/settings/schedule-form";

export default async function SettingsPage() {
  await requirePagePermission("settings.manage");
  const schedule = await getScheduleSettings();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">Settings</h1>
        <p className="text-sm text-[var(--muted)]">Configure FameTerra Agency OS without touching any code.</p>
      </div>
      <SettingsNav />
      <div className="max-w-2xl">
        <ScheduleForm initial={schedule} />
      </div>
    </div>
  );
}
