import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
    });
    
    // Map to client-friendly format
    const formatted = users.map((u) => ({
      id: u.id,
      employee_code: u.employeeCode || `SE-ENG-${u.id.substring(0, 4)}`,
      name: u.name || "Schneider User",
      department: u.department || "Schneider Electric Field Engineering",
      role: u.role,
      email: u.email,
      avatar: u.avatar || u.image || "/images/user/user.png",
      capacity_hours_per_week: u.capacityHoursPerWeek || 40,
    }));

    return NextResponse.json({ success: true, users: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, role } = await request.json();
    if (!userId || !role) {
      return NextResponse.json({ success: false, error: "userId and role are required" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actor: "Admin",
        action: "ROLE_CHANGE",
        details: `Updated role for user ${updated.email} to ${role}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Updated user ${updated.name || userId} access level to ${role}`,
      user: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
