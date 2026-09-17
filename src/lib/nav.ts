import { hasAnyPermission } from "@/lib/permissions";

export type NavIconName =
  | "dashboard"
  | "attendance"
  | "tasks"
  | "clients"
  | "content"
  | "campaigns"
  | "team"
  | "performance"
  | "reports"
  | "notifications"
  | "activity"
  | "settings";

export type NavItem = {
  label: string;
  href: string;
  icon: NavIconName;
  anyOf: string[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard", anyOf: ["dashboard.view.own", "dashboard.view.agency"] },
  { label: "Attendance", href: "/attendance", icon: "attendance", anyOf: ["attendance.own", "attendance.viewAll"] },
  { label: "Tasks", href: "/tasks", icon: "tasks", anyOf: ["tasks.viewOwn", "tasks.viewAll"] },
  { label: "Clients", href: "/clients", icon: "clients", anyOf: ["clients.view"] },
  { label: "Content", href: "/content", icon: "content", anyOf: ["content.view"] },
  { label: "Campaigns", href: "/campaigns", icon: "campaigns", anyOf: ["campaigns.view"] },
  { label: "Team", href: "/team", icon: "team", anyOf: ["employees.view"] },
  { label: "Performance", href: "/performance", icon: "performance", anyOf: ["performance.viewOwn", "performance.viewAll"] },
  { label: "Reports", href: "/reports", icon: "reports", anyOf: ["reports.view"] },
  { label: "Notifications", href: "/notifications", icon: "notifications", anyOf: ["notifications.own"] },
  { label: "Activity Log", href: "/activity", icon: "activity", anyOf: ["activity.view"] },
  { label: "Settings", href: "/settings", icon: "settings", anyOf: ["settings.manage"] },
];

export function visibleNavItems(permissions: string[]) {
  return NAV_ITEMS.filter((item) => hasAnyPermission(permissions, item.anyOf));
}
