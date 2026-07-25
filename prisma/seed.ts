import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Schneider ERP database seed...");

  // Clean existing data
  await prisma.stagingSubmission.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.allowanceRecord.deleteMany({});
  await prisma.allowancePolicy.deleteMany({});
  await prisma.timesheetEntry.deleteMany({});
  await prisma.resourceAllocation.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedDefaultPassword = await bcrypt.hash("password123", 12);
  const hashedAdminPassword = await bcrypt.hash("admin123", 12);
  const hashedManagerPassword = await bcrypt.hash("manager123", 12);

  // 1. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      id: "admin-001",
      employeeCode: "SE-ADM-001",
      name: "Schneider System Admin",
      email: "admin@se.com",
      password: hashedAdminPassword,
      role: "admin",
      department: "IT System Governance",
      avatar: "/images/user/user-05.jpg",
      capacityHoursPerWeek: 40,
    },
  });
  console.log(`✅ Created Admin user: ${adminUser.email}`);

  // 2. Create Manager User
  const managerUser = await prisma.user.create({
    data: {
      id: "mgr-001",
      employeeCode: "SE-MGR-001",
      name: "Manager Level",
      email: "manager@se.com",
      password: hashedManagerPassword,
      role: "manager",
      department: "Field Engineering Operations",
      avatar: "/images/user/user-01.jpg",
      capacityHoursPerWeek: 40,
    },
  });
  console.log(`✅ Created Manager user: ${managerUser.email}`);

  // 3. Create Engineer Users
  const engineersData = [
    {
      id: "eng-001",
      employeeCode: "SE-ENG-101",
      name: "Saya",
      email: "saya@se.com",
      role: "engineer",
      department: "Substation Automation & Protection",
      avatar: "/images/user/user.png",
    },
    {
      id: "eng-002",
      employeeCode: "SE-ENG-102",
      name: "Budi Santoso",
      email: "budi.santoso@se.com",
      role: "engineer",
      department: "SCADA & Power Management",
      avatar: "/images/user/user-02.jpg",
    },
    {
      id: "eng-003",
      employeeCode: "SE-ENG-103",
      name: "Dewi Lestari",
      email: "dewi.lestari@se.com",
      role: "engineer",
      department: "Microgrid & Renewable Energy",
      avatar: "/images/user/user-03.jpg",
    },
    {
      id: "eng-004",
      employeeCode: "SE-ENG-104",
      name: "Agus Setiawan",
      email: "agus.setiawan@se.com",
      role: "engineer",
      department: "Industrial Automation Systems",
      avatar: "/images/user/user-04.jpg",
    },
    {
      id: "eng-005",
      employeeCode: "SE-ENG-105",
      name: "Rina Wijaya",
      email: "rina.wijaya@se.com",
      role: "manager",
      department: "Substation Automation & Protection",
      avatar: "/images/user/user-05.jpg",
    },
  ];

  for (const eng of engineersData) {
    await prisma.user.create({
      data: {
        ...eng,
        password: hashedDefaultPassword,
        capacityHoursPerWeek: 40,
      },
    });
  }
  console.log(`✅ Created ${engineersData.length} Engineer users`);

  // 4. Create Projects
  const projectsData = [
    {
      id: "prj-001",
      projectCode: "PRJ-SE-2026-001",
      name: "PLN Java-Bali 500kV Substation Automation",
      status: "Active",
      startDate: "2026-01-15",
      endDate: "2026-08-30",
      clientName: "PT PLN (Persero)",
      location: "Cilegon, Banten",
    },
    {
      id: "prj-002",
      projectCode: "PRJ-SE-2026-002",
      name: "Data Center HyperScale Power Monitoring System",
      status: "Active",
      startDate: "2026-03-01",
      endDate: "2026-11-15",
      clientName: "Global Data Center Tech",
      location: "Cikarang, West Java",
    },
    {
      id: "prj-003",
      projectCode: "PRJ-SE-2026-003",
      name: "Balongan Refinery Protection & Control Modernization",
      status: "Active",
      startDate: "2026-02-10",
      endDate: "2026-09-20",
      clientName: "PT Pertamina (Persero)",
      location: "Indramayu, West Java",
    },
    {
      id: "prj-004",
      projectCode: "PRJ-SE-2026-004",
      name: "Solar PV Microgrid Monitoring & Energy Storage",
      status: "Planned",
      startDate: "2026-08-01",
      endDate: "2026-12-31",
      clientName: "SE Renewable Energy Solutions",
      location: "Sumbawa, NTB",
    },
  ];

  for (const prj of projectsData) {
    await prisma.project.create({ data: prj });
  }
  console.log(`✅ Created ${projectsData.length} Projects`);

  // 5. Create Allocations
  const allocationsData = [
    {
      id: "alloc-001",
      engineerId: "eng-001",
      projectId: "prj-001",
      startDate: "2026-01-15",
      endDate: "2026-08-30",
      allocationPct: 100,
    },
    {
      id: "alloc-002",
      engineerId: "eng-002",
      projectId: "prj-002",
      startDate: "2026-03-01",
      endDate: "2026-11-15",
      allocationPct: 75,
    },
    {
      id: "alloc-003",
      engineerId: "eng-003",
      projectId: "prj-003",
      startDate: "2026-02-10",
      endDate: "2026-09-20",
      allocationPct: 100,
    },
    {
      id: "alloc-004",
      engineerId: "eng-004",
      projectId: "prj-002",
      startDate: "2026-03-01",
      endDate: "2026-11-15",
      allocationPct: 50,
    },
    {
      id: "alloc-005",
      engineerId: "eng-004",
      projectId: "prj-003",
      startDate: "2026-02-10",
      endDate: "2026-09-20",
      allocationPct: 50,
    },
  ];

  for (const alloc of allocationsData) {
    await prisma.resourceAllocation.create({ data: alloc });
  }
  console.log(`✅ Created ${allocationsData.length} Resource Allocations`);

  // 6. Create Allowance Policies
  const policiesData = [
    {
      id: "pol-001",
      activityType: "Pre-FAT",
      amountIdr: 150000,
      effectiveFrom: "2026-01-01",
      effectiveTo: null,
      description: "Standard Onsite Allowance for Pre-Factory Acceptance Testing (IDR 150,000/day)",
    },
    {
      id: "pol-002",
      activityType: "FAT",
      amountIdr: 150000,
      effectiveFrom: "2026-01-01",
      effectiveTo: null,
      description: "Standard Onsite Allowance for Factory Acceptance Testing (IDR 150,000/day)",
    },
    {
      id: "pol-003",
      activityType: "SAT",
      amountIdr: 150000,
      effectiveFrom: "2026-01-01",
      effectiveTo: null,
      description: "Standard Onsite Allowance for Site Acceptance Testing (IDR 150,000/day)",
    },
  ];

  for (const pol of policiesData) {
    await prisma.allowancePolicy.create({ data: pol });
  }
  console.log(`✅ Created ${policiesData.length} Allowance Policies`);

  // 7. Create Timesheets
  const timesheetsData = [
    {
      id: "ts-001",
      engineerId: "eng-001",
      projectId: "prj-001",
      workDate: "2026-07-14",
      deploymentStatus: "Onsite",
      onsiteActivityType: "SAT",
      siteLocation: "PLN Cilegon 500kV Yard",
      hoursLogged: 8,
      validationStatus: "Validated",
      source: "Google Forms Webhook",
      responseId: "gform-resp-1001",
      createdAt: new Date("2026-07-14T17:30:00Z"),
    },
    {
      id: "ts-002",
      engineerId: "eng-001",
      projectId: "prj-001",
      workDate: "2026-07-15",
      deploymentStatus: "Onsite",
      onsiteActivityType: "SAT",
      siteLocation: "PLN Cilegon 500kV Yard",
      hoursLogged: 8,
      validationStatus: "Validated",
      source: "Google Forms Webhook",
      responseId: "gform-resp-1002",
      createdAt: new Date("2026-07-15T18:00:00Z"),
    },
    {
      id: "ts-003",
      engineerId: "eng-001",
      projectId: "prj-001",
      workDate: "2026-07-16",
      deploymentStatus: "Office",
      onsiteActivityType: "None",
      siteLocation: null,
      hoursLogged: 8,
      validationStatus: "Validated",
      source: "Google Forms Webhook",
      responseId: "gform-resp-1003",
      createdAt: new Date("2026-07-16T17:00:00Z"),
    },
    {
      id: "ts-004",
      engineerId: "eng-002",
      projectId: "prj-002",
      workDate: "2026-07-14",
      deploymentStatus: "Onsite",
      onsiteActivityType: "FAT",
      siteLocation: "SE Cikarang Assembly Plant",
      hoursLogged: 8,
      validationStatus: "Validated",
      source: "Google Forms Webhook",
      responseId: "gform-resp-1004",
      createdAt: new Date("2026-07-14T17:45:00Z"),
    },
    {
      id: "ts-005",
      engineerId: "eng-002",
      projectId: "prj-002",
      workDate: "2026-07-15",
      deploymentStatus: "Onsite",
      onsiteActivityType: "FAT",
      siteLocation: "SE Cikarang Assembly Plant",
      hoursLogged: 8,
      validationStatus: "Validated",
      source: "Google Forms Webhook",
      responseId: "gform-resp-1005",
      createdAt: new Date("2026-07-15T17:50:00Z"),
    },
    {
      id: "ts-006",
      engineerId: "eng-003",
      projectId: "prj-003",
      workDate: "2026-07-16",
      deploymentStatus: "Onsite",
      onsiteActivityType: "Pre-FAT",
      siteLocation: "Pertamina Balongan Substation",
      hoursLogged: 8,
      validationStatus: "Validated",
      source: "Google Forms Webhook",
      responseId: "gform-resp-1006",
      createdAt: new Date("2026-07-16T17:20:00Z"),
    },
    {
      id: "ts-007",
      engineerId: "eng-004",
      projectId: "prj-001",
      workDate: "2026-07-17",
      deploymentStatus: "Onsite",
      onsiteActivityType: "SAT",
      siteLocation: "PLN Cilegon 500kV Yard",
      hoursLogged: 8,
      validationStatus: "Flagged",
      validationNotes: "Allocation mismatch: Engineer SE-ENG-104 is not allocated to project PRJ-SE-2026-001.",
      source: "Google Forms Webhook",
      responseId: "gform-resp-1007",
      createdAt: new Date("2026-07-17T16:15:00Z"),
    },
  ];

  for (const ts of timesheetsData) {
    await prisma.timesheetEntry.create({ data: ts });
  }
  console.log(`✅ Created ${timesheetsData.length} Timesheet entries`);

  // 8. Create Allowance Records
  const allowancesData = [
    {
      id: "alw-001",
      timesheetEntryId: "ts-001",
      engineerId: "eng-001",
      policyId: "pol-003",
      workDate: "2026-07-14",
      activityType: "SAT",
      amountIdr: 150000,
      payrollStatus: "Approved for Payroll",
      payrollPeriod: "July 2026",
      createdAt: new Date("2026-07-14T23:59:00Z"),
    },
    {
      id: "alw-002",
      timesheetEntryId: "ts-002",
      engineerId: "eng-001",
      policyId: "pol-003",
      workDate: "2026-07-15",
      activityType: "SAT",
      amountIdr: 150000,
      payrollStatus: "Approved for Payroll",
      payrollPeriod: "July 2026",
      createdAt: new Date("2026-07-15T23:59:00Z"),
    },
    {
      id: "alw-003",
      timesheetEntryId: "ts-004",
      engineerId: "eng-002",
      policyId: "pol-002",
      workDate: "2026-07-14",
      activityType: "FAT",
      amountIdr: 150000,
      payrollStatus: "Approved for Payroll",
      payrollPeriod: "July 2026",
      createdAt: new Date("2026-07-14T23:59:00Z"),
    },
    {
      id: "alw-004",
      timesheetEntryId: "ts-005",
      engineerId: "eng-002",
      policyId: "pol-002",
      workDate: "2026-07-15",
      activityType: "FAT",
      amountIdr: 150000,
      payrollStatus: "Pending Payroll Approval",
      payrollPeriod: "July 2026",
      createdAt: new Date("2026-07-15T23:59:00Z"),
    },
    {
      id: "alw-005",
      timesheetEntryId: "ts-006",
      engineerId: "eng-003",
      policyId: "pol-001",
      workDate: "2026-07-16",
      activityType: "Pre-FAT",
      amountIdr: 150000,
      payrollStatus: "Pending Payroll Approval",
      payrollPeriod: "July 2026",
      createdAt: new Date("2026-07-16T23:59:00Z"),
    },
  ];

  for (const alw of allowancesData) {
    await prisma.allowanceRecord.create({ data: alw });
  }
  console.log(`✅ Created ${allowancesData.length} Allowance records`);

  // 9. Create Audit Logs
  const auditLogsData = [
    {
      id: "log-001",
      timestamp: new Date("2026-07-01T09:00:00Z"),
      actor: "Rina Wijaya (Admin)",
      action: "POLICY_UPDATE",
      details: "Initialized Onsite Allowance rate to IDR 150,000/day for Pre-FAT, FAT, SAT.",
    },
    {
      id: "log-002",
      timestamp: new Date("2026-07-14T17:31:00Z"),
      actor: "System Webhook Bridge",
      action: "TIMESHEET_PROMOTION",
      details: "Promoted responseId gform-resp-1001 to production timesheets (Validated).",
    },
  ];

  for (const log of auditLogsData) {
    await prisma.auditLog.create({ data: log });
  }
  console.log(`✅ Created ${auditLogsData.length} Audit logs`);

  console.log("🎉 Schneider ERP Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
