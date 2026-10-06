export const DEFAULT_ROLES = [
  { name: "Super Admin", slug: "super_admin", isSystem: true },
  { name: "Head of Operations", slug: "head_of_operations", isSystem: true },
  { name: "Manager", slug: "manager", isSystem: true },
  { name: "Team Lead", slug: "team_lead", isSystem: true },
  { name: "Employee", slug: "employee", isSystem: true },
  { name: "Intern", slug: "intern", isSystem: true },
];

export const DEFAULT_DEPARTMENTS = [
  "Design",
  "Client Service / CS",
  "Digital Marketing",
  "SEO",
  "Development",
  "Content",
  "Intern",
  "Other",
];

export const DEFAULT_LEAVE_TYPES = [
  { name: "Casual Leave", isPaid: true },
  { name: "Sick Leave", isPaid: true },
  { name: "Unpaid Leave", isPaid: false },
];

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}
