import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const engineerId = searchParams.get("engineerId");

    const where: any = {};
    if (engineerId) {
      where.engineerId = engineerId;
    }

    const timesheets = await prisma.timesheetEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formatted = timesheets.map((t) => ({
      id: t.id,
      engineer_id: t.engineerId,
      project_id: t.projectId,
      work_date: t.workDate,
      deployment_status: t.deploymentStatus,
      onsite_activity_type: t.onsiteActivityType,
      site_location: t.siteLocation,
      hours_logged: t.hoursLogged,
      validation_status: t.validationStatus,
      validation_notes: t.validationNotes || undefined,
      source: t.source,
      responseId: t.responseId || undefined,
      createdAt: t.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, timesheets: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { engineer_id, project_id, work_date, deployment_status, onsite_activity_type, site_location, hours_logged } = body;

    if (!engineer_id || !project_id || !work_date) {
      return NextResponse.json({ success: false, error: "engineer_id, project_id, work_date are required" }, { status: 400 });
    }

    // Check allocation mismatch
    const allocations = await prisma.resourceAllocation.findMany({
      where: { engineerId: engineer_id, projectId: project_id },
    });

    const isAllocationMismatch = allocations.length === 0;
    const validationStatus = isAllocationMismatch ? "Flagged" : "Validated";
    const validationNotes = isAllocationMismatch
      ? "Allocation mismatch: Engineer is not allocated to this project."
      : undefined;

    const newTimesheet = await prisma.timesheetEntry.create({
      data: {
        engineerId: engineer_id,
        projectId: project_id,
        workDate: work_date,
        deploymentStatus: deployment_status || "Office",
        onsiteActivityType: onsite_activity_type || "None",
        siteLocation: site_location || null,
        hoursLogged: Number(hours_logged) || 8,
        validationStatus,
        validationNotes,
        source: "PWA Manual Entry",
      },
    });

    // Auto-calculate Allowance if Onsite and Validated
    if (validationStatus === "Validated" && deployment_status === "Onsite" && onsite_activity_type !== "None") {
      const policy = await prisma.allowancePolicy.findUnique({
        where: { activityType: onsite_activity_type },
      });

      if (policy) {
        const existingAllowance = await prisma.allowanceRecord.findFirst({
          where: { engineerId: engineer_id, workDate: work_date },
        });

        if (!existingAllowance) {
          await prisma.allowanceRecord.create({
            data: {
              timesheetEntryId: newTimesheet.id,
              engineerId: engineer_id,
              policyId: policy.id,
              workDate: work_date,
              activityType: onsite_activity_type,
              amountIdr: policy.amountIdr,
              payrollStatus: "Pending Payroll Approval",
              payrollPeriod: "July 2026",
            },
          });
        }
      }
    }

    await prisma.auditLog.create({
      data: {
        actor: "Engineer PWA",
        action: "TIMESHEET_MANUAL_LOG",
        details: `Logged ${hours_logged}h for ${work_date} (${deployment_status || "Office"}) - Status: ${validationStatus}`,
      },
    });

    return NextResponse.json({
      success: true,
      timesheet: {
        id: newTimesheet.id,
        engineer_id: newTimesheet.engineerId,
        project_id: newTimesheet.projectId,
        work_date: newTimesheet.workDate,
        deployment_status: newTimesheet.deploymentStatus,
        onsite_activity_type: newTimesheet.onsiteActivityType,
        site_location: newTimesheet.siteLocation,
        hours_logged: newTimesheet.hoursLogged,
        validation_status: newTimesheet.validationStatus,
        validation_notes: newTimesheet.validationNotes || undefined,
        source: newTimesheet.source,
        createdAt: newTimesheet.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { timesheetId, managerName } = await request.json();
    if (!timesheetId) {
      return NextResponse.json({ success: false, error: "timesheetId is required" }, { status: 400 });
    }

    const updated = await prisma.timesheetEntry.update({
      where: { id: timesheetId },
      data: {
        validationStatus: "Validated",
        validationNotes: `Approved by ${managerName || "Manager"}`,
      },
    });

    // Check if allowance should be generated now that it's validated
    if (updated.deploymentStatus === "Onsite" && updated.onsiteActivityType !== "None") {
      const policy = await prisma.allowancePolicy.findUnique({
        where: { activityType: updated.onsiteActivityType },
      });

      if (policy) {
        const existing = await prisma.allowanceRecord.findFirst({
          where: { engineerId: updated.engineerId, workDate: updated.workDate },
        });

        if (!existing) {
          await prisma.allowanceRecord.create({
            data: {
              timesheetEntryId: updated.id,
              engineerId: updated.engineerId,
              policyId: policy.id,
              workDate: updated.workDate,
              activityType: updated.onsiteActivityType,
              amountIdr: policy.amountIdr,
              payrollStatus: "Pending Payroll Approval",
              payrollPeriod: "July 2026",
            },
          });
        }
      }
    }

    await prisma.auditLog.create({
      data: {
        actor: managerName || "Manager",
        action: "TIMESHEET_APPROVE",
        details: `Approved timesheet entry ${timesheetId}`,
      },
    });

    return NextResponse.json({ success: true, timesheet: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
