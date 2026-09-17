import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { toCsv, csvResponse } from "@/lib/csv";
import { formatDate } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.permissions, "reports.view")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const clients = await prisma.client.findMany({
    include: { assignedCs: true },
    orderBy: { clientName: "asc" },
  });

  const rows = clients.map((c) => ({
    client: c.clientName,
    company: c.companyName ?? "",
    industry: c.industry ?? "",
    package: c.packageName ?? "",
    monthlyFee: c.monthlyFee?.toString() ?? "",
    assignedCs: c.assignedCs?.fullName ?? "",
    status: c.status,
    renewalDate: formatDate(c.renewalDate),
  }));

  const csv = toCsv(rows, [
    { key: "client", label: "Client" },
    { key: "company", label: "Company" },
    { key: "industry", label: "Industry" },
    { key: "package", label: "Package" },
    { key: "monthlyFee", label: "Monthly Fee" },
    { key: "assignedCs", label: "Assigned CS" },
    { key: "status", label: "Status" },
    { key: "renewalDate", label: "Renewal Date" },
  ]);

  return csvResponse("clients-report.csv", csv);
}
