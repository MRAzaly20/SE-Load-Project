import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware, getCurrentUser } from "@/middleware/auth";
import { timesheetSchema, safeValidate } from "@/lib/validators/api";
import { 
  calculateAndCreateAllowance, 
  validateTimesheetAllocation,
  getCurrentPayrollPeriod 
} from "@/services/allowance.service";

export async function GET(request: Request) {
  try {
    // Add authentication check
    const nextReq = request as any;
    const authResult = await authMiddleware(nextReq);
    if (authResult.status !== undefined && authResult.status !== 200) {
      return authResult;
    }

    const currentUser = await getCurrentUser(nextReq);
    const { searchParams } = new URL(request.url);
    const engineerId = searchParams.get("engineerId");

    // Engineers can only see their own timesheets unless they're manager/admin
    let whereClause: any = {};
    if (engineerId) {
      if (currentUser?.role === "engineer" && currentUser.id !== engineerId) {
        return NextResponse.json(
          { success: false, error: "Access denied. Engineers can only view their own timesheets." },
          { status: 403 }
        );
      }
      whereClause.engineerId = engineerId;
    } else if (currentUser?.role === "engineer") {
      whereClause.engineerId = currentUser.id;
    }

    const timesheets = await prisma.timesheetEntry.findMany({
      where: whereClause,
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
    console.error("Error fetching timesheets:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Add authentication check
    const nextReq = request as any;
    const authResult = await authMiddleware(nextReq);
    if (authResult.status !== undefined && authResult.status !== 200) {
      return authResult;
    }

    const currentUser = await getCurrentUser(nextReq);
    
    // Validate request body
    const body = await request.json();
    const validation = safeValidate(timesheetSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const { engineer_id, project_id, work_date, deployment_status, onsite_activity_type, site_location, hours_logged } = validation.data;

    // Engineers can only create timesheets for themselves
    if (currentUser?.role === "engineer" && currentUser.id !== engineer_id) {
      return NextResponse.json(
        { success: false, error: "Access denied. Engineers can only log their own timesheets." },
        { status: 403 }
      );
    }

    // Check allocation mismatch using service
    const allocationCheck = await validateTimesheetAllocation(engineer_id, project_id);

    const newTimesheet = await prisma.timesheetEntry.create({
      data: {
        engineerId: engineer_id,
        projectId: project_id,
        workDate: work_date,
        deploymentStatus: deployment_status || "Office",
        onsiteActivityType: onsite_activity_type || "None",
        siteLocation: site_location || null,
        hoursLogged: Number(hours_logged) || 8,
        validationStatus: allocationCheck.validationStatus,
        validationNotes: allocationCheck.validationNotes,
        source: "PWA Manual Entry",
      },
    });

    // Auto-calculate Allowance if Onsite and Validated (using service)
    if (
      allocationCheck.validationStatus === "Validated" && 
      deployment_status === "Onsite" && 
      onsite_activity_type && 
      onsite_activity_type !== "None"
    ) {
      const allowanceResult = await calculateAndCreateAllowance({
        engineerId: engineer_id,
        workDate,
        deploymentStatus: deployment_status,
        onsiteActivityType: onsite_activity_type,
        timesheetEntryId: newTimesheet.id,
      });

      if (allowanceResult.created) {
        console.log(`Allowance created: ${allowanceResult.message}`);
      }
    }

    await prisma.auditLog.create({
      data: {
        actor: currentUser?.name || currentUser?.email || "Engineer PWA",
        action: "TIMESHEET_MANUAL_LOG",
        details: `Logged ${hours_logged}h for ${work_date} (${deployment_status || "Office"}) - Status: ${allocationCheck.validationStatus}`,
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
    console.error("Error creating timesheet:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // Add authentication and authorization check (manager/admin only)
    const nextReq = request as any;
    const authResult = await authMiddleware(nextReq, { requiredRoles: ["manager", "admin"] });
    if (authResult.status !== undefined && authResult.status !== 200) {
      return authResult;
    }

    const currentUser = await getCurrentUser(nextReq);
    
    const { timesheetId, managerName } = await request.json();
    
    if (!timesheetId) {
      return NextResponse.json(
        { success: false, error: "timesheetId is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.timesheetEntry.update({
      where: { id: timesheetId },
      data: {
        validationStatus: "Validated",
        validationNotes: `Approved by ${managerName || currentUser?.name || "Manager"}`,
      },
    });

    // Check if allowance should be generated now that it's validated (using service)
    if (updated.deploymentStatus === "Onsite" && updated.onsiteActivityType !== "None") {
      const allowanceResult = await calculateAndCreateAllowance({
        engineerId: updated.engineerId,
        workDate: updated.workDate,
        deploymentStatus: updated.deploymentStatus,
        onsiteActivityType: updated.onsiteActivityType,
        timesheetEntryId: updated.id,
      });

      if (allowanceResult.created) {
        console.log(`Allowance created on approval: ${allowanceResult.message}`);
      }
    }

    await prisma.auditLog.create({
      data: {
        actor: currentUser?.name || managerName || "Manager",
        action: "TIMESHEET_APPROVE",
        details: `Approved timesheet entry ${timesheetId}`,
      },
    });

    return NextResponse.json({ success: true, timesheet: updated });
  } catch (error: any) {
    console.error("Error approving timesheet:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
