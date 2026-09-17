import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { ClientForm } from "@/components/clients/client-form";

export default async function NewClientPage() {
  await requirePagePermission("clients.create");
  const csOptions = await prisma.employee.findMany({
    where: { status: "ACTIVE" },
    orderBy: { fullName: "asc" },
    select: { id: true, fullName: true },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-lg font-semibold text-[var(--foreground)]">Add Client</h1>
      <p className="mb-6 text-sm text-[var(--muted)]">
        Once created, this client becomes available immediately when creating tasks, content and campaigns.
      </p>
      <ClientForm mode="create" csOptions={csOptions} />
    </div>
  );
}
