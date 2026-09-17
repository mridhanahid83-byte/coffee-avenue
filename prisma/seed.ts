import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_ROLES, DEFAULT_DEPARTMENTS, DEFAULT_LEAVE_TYPES, slugify } from "../src/lib/seed-data";
import { DEFAULT_ROLE_PERMISSIONS } from "../src/lib/permissions";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding roles...");
  for (const role of DEFAULT_ROLES) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      create: { name: role.name, slug: role.slug, isSystem: role.isSystem, permissions: DEFAULT_ROLE_PERMISSIONS[role.slug] ?? [] },
      update: {},
    });
  }

  console.log("Seeding departments...");
  const departmentRecords: Record<string, string> = {};
  for (const name of DEFAULT_DEPARTMENTS) {
    const slug = slugify(name);
    const dept = await prisma.department.upsert({
      where: { slug },
      create: { name, slug, isSystem: true },
      update: {},
    });
    departmentRecords[name] = dept.id;
  }

  console.log("Seeding leave types...");
  for (const lt of DEFAULT_LEAVE_TYPES) {
    await prisma.leaveType.upsert({ where: { name: lt.name }, create: lt, update: {} });
  }

  const roles = await prisma.role.findMany();
  const roleBySlug = Object.fromEntries(roles.map((r) => [r.slug, r]));

  const passwordHash = await bcrypt.hash("Password123!", 12);

  console.log("Seeding Super Admin...");
  const admin = await prisma.employee.upsert({
    where: { email: "admin@fameterra.com" },
    create: {
      fullName: "Ayesha Rahman",
      email: "admin@fameterra.com",
      phone: "+880 1711-000001",
      passwordHash,
      roleId: roleBySlug["super_admin"].id,
      employeeType: "FULL_TIME",
      status: "ACTIVE",
      joiningDate: new Date("2023-01-10"),
      mustChangePassword: false,
    },
    update: {},
  });

  await prisma.systemState.upsert({
    where: { id: 1 },
    create: { id: 1, setupComplete: true },
    update: { setupComplete: true },
  });

  console.log("Seeding Head of Operations...");
  const headOps = await prisma.employee.upsert({
    where: { email: "operations@fameterra.com" },
    create: {
      fullName: "Tanvir Hossain",
      email: "operations@fameterra.com",
      phone: "+880 1711-000002",
      passwordHash,
      roleId: roleBySlug["head_of_operations"].id,
      departmentId: departmentRecords["Other"],
      employeeType: "FULL_TIME",
      status: "ACTIVE",
      joiningDate: new Date("2023-02-01"),
      mustChangePassword: false,
    },
    update: {},
  });

  console.log("Seeding Team Leads, Managers, Employees, Interns...");
  const designLead = await prisma.employee.upsert({
    where: { email: "design.lead@fameterra.com" },
    create: {
      fullName: "Nabila Karim",
      email: "design.lead@fameterra.com",
      passwordHash,
      roleId: roleBySlug["team_lead"].id,
      departmentId: departmentRecords["Design"],
      employeeType: "FULL_TIME",
      status: "ACTIVE",
      joiningDate: new Date("2023-03-15"),
      managerId: headOps.id,
      mustChangePassword: false,
    },
    update: {},
  });

  const designer = await prisma.employee.upsert({
    where: { email: "designer@fameterra.com" },
    create: {
      fullName: "Rafi Ahmed",
      email: "designer@fameterra.com",
      passwordHash,
      roleId: roleBySlug["employee"].id,
      departmentId: departmentRecords["Design"],
      employeeType: "FULL_TIME",
      status: "ACTIVE",
      joiningDate: new Date("2023-06-01"),
      teamLeadId: designLead.id,
      managerId: headOps.id,
      mustChangePassword: false,
    },
    update: {},
  });

  const csManager = await prisma.employee.upsert({
    where: { email: "cs.manager@fameterra.com" },
    create: {
      fullName: "Sadia Islam",
      email: "cs.manager@fameterra.com",
      passwordHash,
      roleId: roleBySlug["manager"].id,
      departmentId: departmentRecords["Client Service / CS"],
      employeeType: "FULL_TIME",
      status: "ACTIVE",
      joiningDate: new Date("2023-01-20"),
      managerId: headOps.id,
      mustChangePassword: false,
    },
    update: {},
  });

  const dmExecutive = await prisma.employee.upsert({
    where: { email: "dm@fameterra.com" },
    create: {
      fullName: "Imran Chowdhury",
      email: "dm@fameterra.com",
      passwordHash,
      roleId: roleBySlug["employee"].id,
      departmentId: departmentRecords["Digital Marketing"],
      employeeType: "FULL_TIME",
      status: "ACTIVE",
      joiningDate: new Date("2023-08-05"),
      managerId: headOps.id,
      mustChangePassword: false,
    },
    update: {},
  });

  const intern = await prisma.employee.upsert({
    where: { email: "intern@fameterra.com" },
    create: {
      fullName: "Farhan Kabir",
      email: "intern@fameterra.com",
      passwordHash,
      roleId: roleBySlug["intern"].id,
      departmentId: departmentRecords["Intern"],
      employeeType: "INTERN",
      status: "ACTIVE",
      joiningDate: new Date("2024-01-15"),
      teamLeadId: designLead.id,
      managerId: headOps.id,
      mustChangePassword: false,
    },
    update: {},
  });

  const formerEmployee = await prisma.employee.upsert({
    where: { email: "former@fameterra.com" },
    create: {
      fullName: "Zara Hasan",
      email: "former@fameterra.com",
      passwordHash,
      roleId: roleBySlug["employee"].id,
      departmentId: departmentRecords["Content"],
      employeeType: "FULL_TIME",
      status: "INACTIVE",
      joiningDate: new Date("2022-05-01"),
      deactivatedAt: new Date("2024-03-01"),
      notes: "Left the agency in March 2024. Historical records retained.",
      mustChangePassword: false,
    },
    update: {},
  });

  console.log("Seeding clients...");
  const clientA = await prisma.client.upsert({
    where: { id: "seed-client-brewhouse" },
    create: {
      id: "seed-client-brewhouse",
      clientName: "Brewhouse Coffee Co.",
      companyName: "Brewhouse Coffee Co. Ltd",
      contactPerson: "Meherun Nesa",
      email: "meherun@brewhouse.example",
      phone: "+880 1811-222333",
      website: "https://brewhouse.example",
      instagram: "@brewhousecoffee",
      industry: "F&B / Cafe",
      services: "Social media management, Content design, Paid ads",
      packageName: "Growth Package",
      monthlyFee: 45000,
      startDate: new Date("2023-09-01"),
      renewalDate: new Date("2026-09-01"),
      status: "ACTIVE",
      assignedCsId: csManager.id,
      notes: "Prefers warm, earthy tones. Monthly content calendar due by the 25th.",
    },
    update: {},
  });

  const clientB = await prisma.client.upsert({
    where: { id: "seed-client-urbanfit" },
    create: {
      id: "seed-client-urbanfit",
      clientName: "UrbanFit Studio",
      companyName: "UrbanFit Studio Ltd",
      contactPerson: "Rakib Anwar",
      email: "rakib@urbanfit.example",
      phone: "+880 1911-444555",
      website: "https://urbanfit.example",
      instagram: "@urbanfitstudio",
      industry: "Fitness",
      services: "Performance marketing, Reels, SEO",
      packageName: "Premium Package",
      monthlyFee: 75000,
      startDate: new Date("2024-01-15"),
      renewalDate: new Date("2027-01-15"),
      status: "ACTIVE",
      assignedCsId: csManager.id,
    },
    update: {},
  });

  const clientLead = await prisma.client.upsert({
    where: { id: "seed-client-lead" },
    create: {
      id: "seed-client-lead",
      clientName: "Nova Realty Group",
      companyName: "Nova Realty Group",
      contactPerson: "Farzana Yasmin",
      email: "farzana@novarealty.example",
      industry: "Real Estate",
      status: "PROPOSAL",
      assignedCsId: csManager.id,
    },
    update: {},
  });

  await prisma.clientTeam.createMany({
    data: [
      { clientId: clientA.id, employeeId: csManager.id, role: "CS" },
      { clientId: clientA.id, employeeId: designer.id, role: "DESIGNER" },
      { clientId: clientA.id, employeeId: dmExecutive.id, role: "DIGITAL_MARKETER" },
      { clientId: clientB.id, employeeId: csManager.id, role: "CS" },
      { clientId: clientB.id, employeeId: dmExecutive.id, role: "DIGITAL_MARKETER" },
    ],
    skipDuplicates: true,
  });

  console.log("Seeding tasks...");
  const now = new Date();
  const inDays = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

  const taskDefs = [
    {
      title: "Design 5 Instagram carousel posts",
      description: "Weekly carousel content for Brewhouse's new autumn menu.",
      clientId: clientA.id,
      departmentId: departmentRecords["Design"],
      assigneeId: designer.id,
      assignedById: designLead.id,
      reviewerId: designLead.id,
      priority: "HIGH" as const,
      status: "IN_PROGRESS" as const,
      contentType: "Carousel",
      deadline: inDays(0),
      startDate: inDays(-2),
    },
    {
      title: "Write ad copy for UrbanFit New Year campaign",
      description: "3 variations of ad copy for Meta ads.",
      clientId: clientB.id,
      departmentId: departmentRecords["Digital Marketing"],
      assigneeId: dmExecutive.id,
      assignedById: csManager.id,
      reviewerId: headOps.id,
      priority: "URGENT" as const,
      status: "WAITING_REVIEW" as const,
      deadline: inDays(-1),
      startDate: inDays(-4),
      approvalStatus: "PENDING" as const,
    },
    {
      title: "Design brand template set",
      description: "Reusable Canva templates for Brewhouse weekly posts.",
      clientId: clientA.id,
      departmentId: departmentRecords["Design"],
      assigneeId: intern.id,
      assignedById: designLead.id,
      reviewerId: designLead.id,
      priority: "MEDIUM" as const,
      status: "REVISION" as const,
      contentType: "Template",
      deadline: inDays(2),
      startDate: inDays(-3),
    },
    {
      title: "Monthly performance report — UrbanFit",
      description: "Compile Meta + Google Ads performance summary.",
      clientId: clientB.id,
      departmentId: departmentRecords["Digital Marketing"],
      assigneeId: dmExecutive.id,
      assignedById: headOps.id,
      priority: "MEDIUM" as const,
      status: "NOT_STARTED" as const,
      deadline: inDays(5),
    },
    {
      title: "Client onboarding brief — Nova Realty",
      description: "Prepare onboarding questionnaire and kickoff deck.",
      clientId: clientLead.id,
      departmentId: departmentRecords["Client Service / CS"],
      assigneeId: csManager.id,
      assignedById: headOps.id,
      priority: "HIGH" as const,
      status: "NOT_STARTED" as const,
      deadline: inDays(3),
    },
    {
      title: "Reel edit — coffee brewing process",
      description: "15s reel showcasing the pour-over process.",
      clientId: clientA.id,
      departmentId: departmentRecords["Design"],
      assigneeId: designer.id,
      assignedById: designLead.id,
      reviewerId: designLead.id,
      priority: "LOW" as const,
      status: "COMPLETED" as const,
      contentType: "Reel",
      deadline: inDays(-5),
      startDate: inDays(-8),
      completedAt: inDays(-6),
      approvalStatus: "APPROVED" as const,
    },
  ];

  for (const def of taskDefs) {
    const existing = await prisma.task.findFirst({ where: { title: def.title } });
    if (existing) continue;
    const task = await prisma.task.create({ data: def });
    await prisma.taskActivity.create({
      data: {
        taskId: task.id,
        actorId: def.assignedById,
        action: "TASK_CREATED",
        toValue: def.status,
        note: `Task created and assigned`,
      },
    });
  }

  console.log("Seeding attendance for the last 5 working days...");
  const employeesForAttendance = [headOps, designLead, designer, csManager, dmExecutive, intern];
  for (let d = 1; d <= 5; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    date.setHours(0, 0, 0, 0);
    const dow = date.getDay();
    if (![0, 1, 2, 3, 4].includes(dow)) continue; // Sun-Thu working days
    for (const emp of employeesForAttendance) {
      const checkIn = new Date(date);
      const lateOffset = Math.random() > 0.7 ? 20 : 0;
      checkIn.setHours(11, lateOffset, 0, 0);
      const checkOut = new Date(date);
      checkOut.setHours(23, 45, 0, 0);
      await prisma.attendance.upsert({
        where: { employeeId_date: { employeeId: emp.id, date } },
        create: {
          employeeId: emp.id,
          date,
          checkInAt: checkIn,
          checkOutAt: checkOut,
          status: lateOffset > 0 ? "LATE" : "PRESENT",
          lateMinutes: lateOffset,
          workingMinutes: Math.round((checkOut.getTime() - checkIn.getTime()) / 60000),
        },
        update: {},
      });
    }
  }

  console.log("Seeding a holiday...");
  await prisma.holiday.upsert({
    where: { date: new Date(new Date().getFullYear(), 11, 16) },
    create: { date: new Date(new Date().getFullYear(), 11, 16), name: "Victory Day" },
    update: {},
  });

  void formerEmployee;
  console.log("Seed complete.");
  console.log("Login with: admin@fameterra.com / Password123!  (Super Admin)");
  console.log("Or: operations@fameterra.com / Password123!  (Head of Operations)");
  console.log("Or: designer@fameterra.com / Password123!  (Employee)");
  console.log("Or: intern@fameterra.com / Password123!  (Intern)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
