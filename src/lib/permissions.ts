// Central permission catalogue for FameTerra Agency OS.
// Every permission check in the app (pages, server actions, API routes) goes
// through hasPermission() below so access control is enforced server-side,
// never only by hiding UI elements. Permissions live on Role.permissions
// (a JSON string array) so Admins can edit them from Settings without a
// code change — SUPER_ADMIN uses the wildcard "*" for unconditional access.

export const PERMISSION_GROUPS: { group: string; items: { key: string; label: string }[] }[] = [
  {
    group: "Dashboard",
    items: [
      { key: "dashboard.view.own", label: "View personal dashboard" },
      { key: "dashboard.view.agency", label: "View agency-wide dashboard" },
    ],
  },
  {
    group: "Employees",
    items: [
      { key: "employees.view", label: "View team directory" },
      { key: "employees.create", label: "Create employees" },
      { key: "employees.edit", label: "Edit employees" },
      { key: "employees.changeStatus", label: "Activate / deactivate / suspend employees" },
      { key: "employees.changeRole", label: "Change role & department" },
      { key: "employees.resetPassword", label: "Issue temporary passwords" },
    ],
  },
  {
    group: "Departments & Roles",
    items: [{ key: "org.manage", label: "Manage departments & roles" }],
  },
  {
    group: "Clients",
    items: [
      { key: "clients.view", label: "View clients" },
      { key: "clients.create", label: "Create clients" },
      { key: "clients.edit", label: "Edit clients" },
      { key: "clients.manageStatus", label: "Pause / archive / reactivate clients" },
      { key: "clients.assignTeam", label: "Assign team to clients" },
    ],
  },
  {
    group: "Attendance",
    items: [
      { key: "attendance.own", label: "Check in / out & view own attendance" },
      { key: "attendance.viewAll", label: "View agency-wide attendance" },
      { key: "attendance.correct", label: "Correct attendance records" },
    ],
  },
  {
    group: "Leave",
    items: [
      { key: "leave.request", label: "Request leave" },
      { key: "leave.review", label: "Approve / reject leave" },
      { key: "leave.manageTypes", label: "Manage leave types & holidays" },
    ],
  },
  {
    group: "Tasks",
    items: [
      { key: "tasks.viewOwn", label: "View own tasks" },
      { key: "tasks.viewAll", label: "View all tasks" },
      { key: "tasks.create", label: "Create tasks" },
      { key: "tasks.assign", label: "Assign / reassign tasks" },
      { key: "tasks.editRestrictedFields", label: "Change client, deadline, priority, assignee" },
      { key: "tasks.review", label: "Review & approve deliveries" },
      { key: "tasks.updateOwn", label: "Update status / comment / deliver on own tasks" },
    ],
  },
  {
    group: "Content",
    items: [
      { key: "content.view", label: "View content pipeline" },
      { key: "content.manage", label: "Manage content items" },
    ],
  },
  {
    group: "Campaigns",
    items: [
      { key: "campaigns.view", label: "View campaigns" },
      { key: "campaigns.manage", label: "Manage campaigns" },
    ],
  },
  {
    group: "Performance & Reports",
    items: [
      { key: "performance.viewOwn", label: "View own performance" },
      { key: "performance.viewAll", label: "View agency performance" },
      { key: "reports.view", label: "View & export reports" },
    ],
  },
  {
    group: "System",
    items: [
      { key: "notifications.own", label: "Receive notifications" },
      { key: "activity.view", label: "View activity log" },
      { key: "settings.manage", label: "Manage system settings" },
    ],
  },
];

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) => g.items.map((i) => i.key));

export const WILDCARD = "*";

export function hasPermission(permissions: string[] | undefined | null, key: string): boolean {
  if (!permissions) return false;
  return permissions.includes(WILDCARD) || permissions.includes(key);
}

export function hasAnyPermission(permissions: string[] | undefined | null, keys: string[]): boolean {
  return keys.some((k) => hasPermission(permissions, k));
}

// Default permission sets used when seeding the six built-in roles.
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [WILDCARD],
  head_of_operations: [
    "dashboard.view.own",
    "dashboard.view.agency",
    "employees.view",
    "employees.create",
    "employees.edit",
    "employees.changeStatus",
    "employees.changeRole",
    "employees.resetPassword",
    "org.manage",
    "clients.view",
    "clients.create",
    "clients.edit",
    "clients.manageStatus",
    "clients.assignTeam",
    "attendance.own",
    "attendance.viewAll",
    "attendance.correct",
    "leave.request",
    "leave.review",
    "leave.manageTypes",
    "tasks.viewOwn",
    "tasks.viewAll",
    "tasks.create",
    "tasks.assign",
    "tasks.editRestrictedFields",
    "tasks.review",
    "tasks.updateOwn",
    "content.view",
    "content.manage",
    "campaigns.view",
    "campaigns.manage",
    "performance.viewOwn",
    "performance.viewAll",
    "reports.view",
    "notifications.own",
    "activity.view",
    "settings.manage",
  ],
  manager: [
    "dashboard.view.own",
    "dashboard.view.agency",
    "employees.view",
    "clients.view",
    "clients.edit",
    "clients.assignTeam",
    "attendance.own",
    "attendance.viewAll",
    "leave.request",
    "leave.review",
    "tasks.viewOwn",
    "tasks.viewAll",
    "tasks.create",
    "tasks.assign",
    "tasks.editRestrictedFields",
    "tasks.review",
    "tasks.updateOwn",
    "content.view",
    "content.manage",
    "campaigns.view",
    "campaigns.manage",
    "performance.viewOwn",
    "performance.viewAll",
    "reports.view",
    "notifications.own",
    "activity.view",
  ],
  team_lead: [
    "dashboard.view.own",
    "employees.view",
    "clients.view",
    "attendance.own",
    "attendance.viewAll",
    "leave.request",
    "leave.review",
    "tasks.viewOwn",
    "tasks.viewAll",
    "tasks.create",
    "tasks.assign",
    "tasks.review",
    "tasks.updateOwn",
    "content.view",
    "content.manage",
    "campaigns.view",
    "performance.viewOwn",
    "performance.viewAll",
    "notifications.own",
  ],
  employee: [
    "dashboard.view.own",
    "clients.view",
    "attendance.own",
    "leave.request",
    "tasks.viewOwn",
    "tasks.updateOwn",
    "content.view",
    "campaigns.view",
    "performance.viewOwn",
    "notifications.own",
  ],
  intern: [
    "dashboard.view.own",
    "attendance.own",
    "leave.request",
    "tasks.viewOwn",
    "tasks.updateOwn",
    "performance.viewOwn",
    "notifications.own",
  ],
};
