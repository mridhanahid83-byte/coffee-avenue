import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { ContentForm } from "@/components/content/content-form";

export default async function NewContentPage() {
  await requirePagePermission("content.manage");
  const [clients, employees] = await Promise.all([
    prisma.client.findMany({ where: { status: { notIn: ["ARCHIVED"] } }, orderBy: { clientName: "asc" } }),
    prisma.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-lg font-semibold text-[var(--foreground)]">New Content</h1>
      <p className="mb-6 text-sm text-[var(--muted)]">Track a content item from brief through publishing.</p>
      <ContentForm
        mode="create"
        clients={clients.map((c) => ({ id: c.id, name: c.clientName }))}
        employees={employees.map((e) => ({ id: e.id, fullName: e.fullName }))}
      />
    </div>
  );
}
