import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload.engineer_code || !payload.project_code || !payload.work_date || !payload.deployment_status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields in Google Form webhook payload." },
        { status: 400 }
      );
    }

    const responseId = `gform-resp-${Date.now()}`;
    const engineerCode = payload.engineer_code.trim();
    const projectCode = payload.project_code.trim();

    // 1. Find engineer & project in PostgreSQL
    const engineer = await prisma.user.findFirst({
      where: { employeeCode: engineerCode },
    });

    const project = await prisma.project.findUnique({
      where: { projectCode },
    });

    const validationErrors: string[] = [];
    if (!engineer) validationErrors.push(`Engineer with code ${engineerCode} not found in database.`);
    if (!project) validationErrors.push(`Project with code ${projectCode} not found in database.`);

    let isAllocationMismatch = false;
    if (engineer && project) {
      const allocation = await prisma.resourceAllocation.findFirst({
        where: { engineerId: engineer.id, projectId: project.id },
      });
      if (!allocation) {
        isAllocationMismatch = true;
        validationErrors.push(`Allocation mismatch: Engineer ${engineerCode} is not allocated to project ${projectCode}.`);
      }
    }

    const hasHardErrors = !engineer || !project;
    const stagingStatus = hasHardErrors ? "Failed Validation" : "Promoted";
    const validation_status = hasHardErrors ? "Pending Review" : isAllocationMismatch ? "Flagged" : "Validated";

    // 2. Record Staging Submission
    const staging = await prisma.stagingSubmission.create({
      data: {
        responseId,
        engineerCode,
        projectCode,
        workDate: payload.work_date,
        deploymentStatus: payload.deployment_status,
        onsiteActivityType: payload.onsite_activity_type || "None",
        siteLocation: payload.site_location || null,
        hoursLogged: Number(payload.hours_logged) || 8,
        signature: payload.signature || `ELECTRONIC_SIG_${engineerCode}`,
        status: stagingStatus,
        validationErrors: validationErrors.length > 0 ? JSON.stringify(validationErrors) : null,
      },
    });

    if (hasHardErrors) {
      await prisma.auditLog.create({
        data: {
          actor: "Ingestion Webhook Bridge",
          action: "WEBHOOK_INGEST_FAIL",
          details: `Payload ${responseId} failed validation: ${validationErrors.join("; ")}`,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Ingestion staged with validation errors.",
          staging,
        },
        { status: 422 }
      );
    }

    // 3. Promote to Timesheet Entry
    const promotedTimesheet = await prisma.timesheetEntry.create({
      data: {
        engineerId: engineer!.id,
        projectId: project!.id,
        workDate: payload.work_date,
        deploymentStatus: payload.deployment_status,
        onsiteActivityType: payload.onsite_activity_type || "None",
        siteLocation: payload.site_location || null,
        hoursLogged: Number(payload.hours_logged) || 8,
        validationStatus: validation_status,
        validationNotes: isAllocationMismatch ? validationErrors.join("; ") : undefined,
        source: "Google Forms Webhook",
        responseId,
      },
    });

    // 4. Calculate Allowance if Onsite and Validated
    if (validation_status === "Validated" && payload.deployment_status === "Onsite" && payload.onsite_activity_type) {
      const policy = await prisma.allowancePolicy.findUnique({
        where: { activityType: payload.onsite_activity_type },
      });

      if (policy) {
        const existing = await prisma.allowanceRecord.findFirst({
          where: { engineerId: engineer!.id, workDate: payload.work_date },
        });

        if (!existing) {
          await prisma.allowanceRecord.create({
            data: {
              timesheetEntryId: promotedTimesheet.id,
              engineerId: engineer!.id,
              policyId: policy.id,
              workDate: payload.work_date,
              activityType: payload.onsite_activity_type,
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
        actor: "Ingestion Webhook Bridge",
        action: "WEBHOOK_INSPECT_PROMOTE",
        details: `Processed payload ${responseId} -> Promoted to Timesheets (${validation_status})`,
      },
    });

    return NextResponse.json({
      success: true,
      message: isAllocationMismatch
        ? "Submitted successfully with soft warning (Flagged for Manager Approval)."
        : "Submitted and promoted successfully (Validated).",
      staging,
      timesheet: promotedTimesheet,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const staging = await prisma.stagingSubmission.findMany({
      orderBy: { submittedAt: "desc" },
    });

    const formatted = staging.map((s) => ({
      responseId: s.responseId,
      submittedAt: s.submittedAt.toISOString(),
      engineer_code: s.engineerCode,
      project_code: s.projectCode,
      work_date: s.workDate,
      deployment_status: s.deploymentStatus,
      onsite_activity_type: s.onsiteActivityType,
      site_location: s.siteLocation || undefined,
      hours_logged: s.hoursLogged,
      signature: s.signature || "",
      status: s.status,
      validationErrors: s.validationErrors ? JSON.parse(s.validationErrors) : undefined,
    }));

    return NextResponse.json({ success: true, staging: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
