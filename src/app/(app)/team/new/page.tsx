import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { EmployeeForm } from "@/components/team/employee-form";

export default async function NewEmployeePage() {
  await requirePagePermission("employees.create");

  const [roles, departments, employees] = await Promise.all([
    prisma.role.findMany({ orderBy: { name: "asc" } }),
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" }, select: { id: true, fullName: true } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-lg font-semibold text-[var(--foreground)]">Add Employee</h1>
      <p className="mb-6 text-sm text-[var(--muted)]">
        Create an individual account for a new team member. A temporary password will be generated for their first login.
      </p>
      <EmployeeForm mode="create" roles={roles} departments={departments} employees={employees} canChangeRole />
    </div>
  );
}
