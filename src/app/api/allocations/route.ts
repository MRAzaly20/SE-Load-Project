import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const allocations = await prisma.resourceAllocation.findMany({
      orderBy: { createdAt: "asc" },
    });

    const formatted = allocations.map((a) => ({
      id: a.id,
      engineer_id: a.engineerId,
      project_id: a.projectId,
      start_date: a.startDate,
      end_date: a.endDate,
      allocation_pct: a.allocationPct,
    }));

    return NextResponse.json({ success: true, allocations: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
