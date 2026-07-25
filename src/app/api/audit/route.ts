import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    const formatted = logs.map((l) => ({
      id: l.id,
      timestamp: l.timestamp.toISOString(),
      actor: l.actor,
      action: l.action,
      details: l.details,
    }));

    return NextResponse.json({ success: true, logs: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { actor, action, details } = await request.json();
    if (!actor || !action) {
      return NextResponse.json({ success: false, error: "actor and action are required" }, { status: 400 });
    }

    const newLog = await prisma.auditLog.create({
      data: {
        actor,
        action,
        details: details || "",
      },
    });

    return NextResponse.json({ success: true, log: newLog });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
