import { notFound } from "next/navigation";
import { requirePagePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { ClientForm } from "@/components/clients/client-form";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePagePermission("clients.edit");
  const { id } = await params;

  const [client, csOptions] = await Promise.all([
    prisma.client.findUnique({ where: { id } }),
    prisma.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" }, select: { id: true, fullName: true } }),
  ]);
  if (!client) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-lg font-semibold text-[var(--foreground)]">Edit {client.clientName}</h1>
      <p className="mb-6 text-sm text-[var(--muted)]">Update client information, engagement and assignment.</p>
      <ClientForm
        mode="edit"
        csOptions={csOptions}
        initial={{
          id: client.id,
          clientName: client.clientName,
          companyName: client.companyName,
          contactPerson: client.contactPerson,
          phone: client.phone,
          email: client.email,
          website: client.website,
          facebook: client.facebook,
          instagram: client.instagram,
          industry: client.industry,
          services: client.services,
          packageName: client.packageName,
          monthlyFee: client.monthlyFee ? client.monthlyFee.toString() : null,
          startDate: client.startDate ? client.startDate.toISOString().slice(0, 10) : null,
          renewalDate: client.renewalDate ? client.renewalDate.toISOString().slice(0, 10) : null,
          assignedCsId: client.assignedCsId,
          notes: client.notes,
          status: client.status,
        }}
      />
    </div>
  );
}
