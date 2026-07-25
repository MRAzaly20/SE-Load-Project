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

    const allowances = await prisma.allowanceRecord.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formatted = allowances.map((a) => ({
      id: a.id,
      timesheet_entry_id: a.timesheetEntryId,
      engineer_id: a.engineerId,
      policy_id: a.policyId,
      work_date: a.workDate,
      activity_type: a.activityType,
      amount_idr: a.amountIdr,
      payroll_status: a.payrollStatus,
      payroll_period: a.payrollPeriod,
      createdAt: a.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, allowances: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { allowanceId } = await request.json();
    if (!allowanceId) {
      return NextResponse.json({ success: false, error: "allowanceId is required" }, { status: 400 });
    }

    const updated = await prisma.allowanceRecord.update({
      where: { id: allowanceId },
      data: { payrollStatus: "Approved for Payroll" },
    });

    await prisma.auditLog.create({
      data: {
        actor: "Manager",
        action: "PAYROLL_ALLOWANCE_APPROVE",
        details: `Approved allowance record ${allowanceId} for payroll (IDR ${updated.amountIdr.toLocaleString()})`,
      },
    });

    return NextResponse.json({ success: true, allowance: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
