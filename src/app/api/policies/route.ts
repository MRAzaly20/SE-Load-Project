import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const policies = await prisma.allowancePolicy.findMany({
      orderBy: { activityType: "asc" },
    });

    const formatted = policies.map((p) => ({
      id: p.id,
      activity_type: p.activityType,
      amount_idr: p.amountIdr,
      effective_from: p.effectiveFrom,
      effective_to: p.effectiveTo,
      description: p.description,
    }));

    return NextResponse.json({ success: true, policies: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { policyId, amount_idr } = await request.json();
    if (!policyId || amount_idr === undefined) {
      return NextResponse.json({ success: false, error: "policyId and amount_idr are required" }, { status: 400 });
    }

    const updated = await prisma.allowancePolicy.update({
      where: { id: policyId },
      data: { amountIdr: Number(amount_idr) },
    });

    await prisma.auditLog.create({
      data: {
        actor: "Admin",
        action: "POLICY_UPDATE",
        details: `Updated policy ${policyId} (${updated.activityType}) amount to IDR ${Number(amount_idr).toLocaleString()}`,
      },
    });

    return NextResponse.json({ success: true, policy: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
