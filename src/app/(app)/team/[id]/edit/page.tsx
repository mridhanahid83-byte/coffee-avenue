import { notFound } from "next/navigation";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { EmployeeForm } from "@/components/team/employee-form";

export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePagePermission("employees.edit");
  const { id } = await params;

  const [employee, roles, departments, employees] = await Promise.all([
    prisma.employee.findUnique({ where: { id } }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" }, select: { id: true, fullName: true } }),
  ]);

  if (!employee) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-lg font-semibold text-[var(--foreground)]">Edit {employee.fullName}</h1>
      <p className="mb-6 text-sm text-[var(--muted)]">Update employee details, reporting lines and assignment.</p>
      <EmployeeForm
        mode="edit"
        roles={roles}
        departments={departments}
        employees={employees}
        canChangeRole={hasPermission(session.user.permissions, "employees.changeRole")}
        initial={{
          id: employee.id,
          fullName: employee.fullName,
          email: employee.email,
          phone: employee.phone,
          roleId: employee.roleId,
          departmentId: employee.departmentId,
          employeeType: employee.employeeType,
          joiningDate: employee.joiningDate ? employee.joiningDate.toISOString().slice(0, 10) : null,
          managerId: employee.managerId,
          teamLeadId: employee.teamLeadId,
          notes: employee.notes,
        }}
      />
    </div>
  );
}
