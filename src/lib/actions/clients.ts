"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionPermission } from "@/lib/auth-guard";
import { logActivity } from "@/lib/activity";

const clientSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  companyName: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  website: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  industry: z.string().optional(),
  services: z.string().optional(),
  packageName: z.string().optional(),
  monthlyFee: z.string().optional(),
  startDate: z.string().optional(),
  renewalDate: z.string().optional(),
  assignedCsId: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["LEAD", "PROPOSAL", "ONBOARDING", "ACTIVE", "PAUSED", "COMPLETED", "LOST", "ARCHIVED"]),
});

export type ClientFormState = { error?: string; success?: boolean; clientId?: string };

function parseClientForm(formData: FormData) {
  return clientSchema.safeParse({
    clientName: formData.get("clientName"),
    companyName: formData.get("companyName") || undefined,
    contactPerson: formData.get("contactPerson") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || "",
    website: formData.get("website") || undefined,
    facebook: formData.get("facebook") || undefined,
    instagram: formData.get("instagram") || undefined,
    industry: formData.get("industry") || undefined,
    services: formData.get("services") || undefined,
    packageName: formData.get("packageName") || undefined,
    monthlyFee: formData.get("monthlyFee") || undefined,
    startDate: formData.get("startDate") || undefined,
    renewalDate: formData.get("renewalDate") || undefined,
    assignedCsId: formData.get("assignedCsId") || undefined,
    notes: formData.get("notes") || undefined,
    status: formData.get("status"),
  });
}

export async function createClient(_prev: ClientFormState, formData: FormData): Promise<ClientFormState> {
  const session = await requireActionPermission("clients.create");
  const parsed = parseClientForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  try {
    const client = await prisma.client.create({
      data: {
        clientName: d.clientName,
        companyName: d.companyName,
        contactPerson: d.contactPerson,
        phone: d.phone,
        email: d.email || undefined,
        website: d.website,
        facebook: d.facebook,
        instagram: d.instagram,
        industry: d.industry,
        services: d.services,
        packageName: d.packageName,
        monthlyFee: d.monthlyFee ? Number(d.monthlyFee) : undefined,
        startDate: d.startDate ? new Date(d.startDate) : undefined,
        renewalDate: d.renewalDate ? new Date(d.renewalDate) : undefined,
        assignedCsId: d.assignedCsId || undefined,
        notes: d.notes,
        status: d.status,
      },
    });

    await logActivity({
      actorId: session.user.id,
      action: "CLIENT_CREATED",
      entityType: "Client",
      entityId: client.id,
      description: `${session.user.name} added client ${client.clientName}`,
    });

    revalidatePath("/clients");
    return { success: true, clientId: client.id };
  } catch {
    return { error: "Unable to save client. Please try again." };
  }
}

export async function updateClient(_prev: ClientFormState, formData: FormData): Promise<ClientFormState> {
  const session = await requireActionPermission("clients.edit");
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing client id." };
  const parsed = parseClientForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  try {
    const client = await prisma.client.update({
      where: { id },
      data: {
        clientName: d.clientName,
        companyName: d.companyName,
        contactPerson: d.contactPerson,
        phone: d.phone,
        email: d.email || null,
        website: d.website,
        facebook: d.facebook,
        instagram: d.instagram,
        industry: d.industry,
        services: d.services,
        packageName: d.packageName,
        monthlyFee: d.monthlyFee ? Number(d.monthlyFee) : null,
        startDate: d.startDate ? new Date(d.startDate) : null,
        renewalDate: d.renewalDate ? new Date(d.renewalDate) : null,
        assignedCsId: d.assignedCsId || null,
        notes: d.notes,
        status: d.status,
      },
    });

    await logActivity({
      actorId: session.user.id,
      action: "CLIENT_UPDATED",
      entityType: "Client",
      entityId: client.id,
      description: `${session.user.name} updated client ${client.clientName}`,
    });

    revalidatePath("/clients");
    revalidatePath(`/clients/${id}`);
    return { success: true, clientId: client.id };
  } catch {
    return { error: "Unable to save changes. Please try again." };
  }
}

const STATUS_LABELS: Record<string, string> = {
  LEAD: "Lead",
  PROPOSAL: "Proposal",
  ONBOARDING: "Onboarding",
  ACTIVE: "Active",
  PAUSED: "Paused",
  COMPLETED: "Completed",
  LOST: "Lost",
  ARCHIVED: "Archived",
};

export async function changeClientStatus(clientId: string, status: keyof typeof STATUS_LABELS) {
  const session = await requireActionPermission("clients.manageStatus");

  const client = await prisma.client.update({
    where: { id: clientId },
    data: { status: status as never, archivedAt: status === "ARCHIVED" ? new Date() : null },
  });

  await logActivity({
    actorId: session.user.id,
    action: "CLIENT_STATUS_CHANGED",
    entityType: "Client",
    entityId: client.id,
    description: `${session.user.name} set ${client.clientName}'s status to ${STATUS_LABELS[status]}`,
  });

  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
  return { ok: true };
}

const teamAssignmentSchema = z.object({
  clientId: z.string().min(1),
  employeeId: z.string().min(1),
  role: z.enum(["CS", "DESIGNER", "DIGITAL_MARKETER", "DEVELOPER", "OTHER"]),
});

export async function assignClientTeamMember(_prev: { error?: string }, formData: FormData) {
  const session = await requireActionPermission("clients.assignTeam");
  const parsed = teamAssignmentSchema.safeParse({
    clientId: formData.get("clientId"),
    employeeId: formData.get("employeeId"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: "Invalid input" };

  const client = await prisma.client.findUnique({ where: { id: parsed.data.clientId } });
  const employee = await prisma.employee.findUnique({ where: { id: parsed.data.employeeId } });
  if (!client || !employee) return { error: "Client or employee not found." };

  await prisma.clientTeam.upsert({
    where: {
      clientId_employeeId_role: {
        clientId: parsed.data.clientId,
        employeeId: parsed.data.employeeId,
        role: parsed.data.role,
      },
    },
    create: parsed.data,
    update: {},
  });

  await logActivity({
    actorId: session.user.id,
    action: "CLIENT_TEAM_ASSIGNED",
    entityType: "Client",
    entityId: client.id,
    description: `${session.user.name} assigned ${employee.fullName} to ${client.clientName}`,
  });

  revalidatePath(`/clients/${parsed.data.clientId}`);
  return {};
}

export async function removeClientTeamMember(clientTeamId: string, clientId: string) {
  const session = await requireActionPermission("clients.assignTeam");
  const record = await prisma.clientTeam.delete({ where: { id: clientTeamId }, include: { employee: true, client: true } });

  await logActivity({
    actorId: session.user.id,
    action: "CLIENT_TEAM_REMOVED",
    entityType: "Client",
    entityId: clientId,
    description: `${session.user.name} removed ${record.employee.fullName} from ${record.client.clientName}`,
  });

  revalidatePath(`/clients/${clientId}`);
  return { ok: true };
}
