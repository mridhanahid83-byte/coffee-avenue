import Link from "next/link";
import { UserPlus, Users2 } from "lucide-react";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { initials } from "@/lib/utils";

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; department?: string; role?: string; status?: string }>;
}) {
  const session = await requirePagePermission("employees.view");
  const params = await searchParams;

  const [departments, roles] = await Promise.all([
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
  ]);

  const employees = await prisma.employee.findMany({
    where: {
      ...(params.q
        ? {
            OR: [
              { fullName: { contains: params.q, mode: "insensitive" } },
              { email: { contains: params.q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(params.department ? { departmentId: params.department } : {}),
      ...(params.role ? { roleId: params.role } : {}),
      ...(params.status ? { status: params.status as "ACTIVE" | "INACTIVE" | "SUSPENDED" } : {}),
    },
    include: { role: true, department: true, manager: true },
    orderBy: [{ status: "asc" }, { fullName: "asc" }],
  });

  const canCreate = hasPermission(session.user.permissions, "employees.create");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Team</h1>
          <p className="text-sm text-[var(--muted)]">{employees.length} employee{employees.length === 1 ? "" : "s"} matching your filters</p>
        </div>
        {canCreate && (
          <Link href="/team/new">
            <Button>
              <UserPlus className="h-4 w-4" /> Add Employee
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <form className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input name="q" placeholder="Search name or email" defaultValue={params.q} />
          <Select name="department" defaultValue={params.department ?? ""}>
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
          <Select name="role" defaultValue={params.role ?? ""}>
            <option value="">All roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </Select>
          <Select name="status" defaultValue={params.status ?? ""}>
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </Select>
          <div className="sm:col-span-2 lg:col-span-4">
            <Button type="submit" variant="secondary" size="sm">
              Apply filters
            </Button>
          </div>
        </form>
      </Card>

      {employees.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No employees found"
          description="Try adjusting your filters, or add the first member of your team."
          actionHref={canCreate ? "/team/new" : undefined}
          actionLabel={canCreate ? "Add Employee" : undefined}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((e) => (
              <TableRow key={e.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`/team/${e.id}`} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
                      {initials(e.fullName)}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{e.fullName}</p>
                      <p className="text-xs text-[var(--muted)]">{e.email}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>{e.role.name}</TableCell>
                <TableCell>{e.department?.name ?? "—"}</TableCell>
                <TableCell>
                  <StatusBadge type="employeeType" value={e.employeeType} />
                </TableCell>
                <TableCell>{e.manager?.fullName ?? "—"}</TableCell>
                <TableCell>
                  <StatusBadge type="employeeStatus" value={e.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
