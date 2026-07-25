import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { projectCode: "asc" },
    });

    const formatted = projects.map((p) => ({
      id: p.id,
      project_code: p.projectCode,
      name: p.name,
      status: p.status,
      start_date: p.startDate,
      end_date: p.endDate,
      client_name: p.clientName,
      location: p.location,
    }));

    return NextResponse.json({ success: true, projects: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { project_code, name, client_name, location, start_date, end_date } = body;

    if (!project_code || !name) {
      return NextResponse.json({ success: false, error: "project_code and name are required" }, { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        projectCode: project_code,
        name,
        clientName: client_name || "Schneider Client",
        location: location || "Indonesia",
        startDate: start_date || new Date().toISOString().split("T")[0],
        endDate: end_date || "2026-12-31",
        status: "Active",
      },
    });

    await prisma.auditLog.create({
      data: {
        actor: "Admin",
        action: "PROJECT_CREATE",
        details: `Added project ${newProject.projectCode} - ${newProject.name}`,
      },
    });

    return NextResponse.json({
      success: true,
      project: {
        id: newProject.id,
        project_code: newProject.projectCode,
        name: newProject.name,
        status: newProject.status,
        start_date: newProject.startDate,
        end_date: newProject.endDate,
        client_name: newProject.clientName,
        location: newProject.location,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { projectId, status } = await request.json();
    if (!projectId || !status) {
      return NextResponse.json({ success: false, error: "projectId and status are required" }, { status: 400 });
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        actor: "Admin",
        action: "PROJECT_UPDATE",
        details: `Updated project ${updated.projectCode} status to ${status}`,
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
