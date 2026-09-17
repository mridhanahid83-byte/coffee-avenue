import { requireSession } from "@/lib/auth-guard";
import { visibleNavItems } from "@/lib/nav";
import { AppShell } from "@/components/layout/app-shell";
import { getScheduleSettings } from "@/lib/settings";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const navItems = visibleNavItems(session.user.permissions);
  const schedule = await getScheduleSettings();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell
      navItems={navItems}
      agencyName={schedule.agencyName}
      today={today}
      user={{
        name: session.user.name ?? "",
        roleName: session.user.roleName,
        email: session.user.email ?? "",
        photoUrl: session.user.image,
      }}
    >
      {children}
    </AppShell>
  );
}
