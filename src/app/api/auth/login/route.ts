import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, email, username, password } = body;
    const cleanUser = (username || email || "").trim().toLowerCase();
    const targetEmail = cleanUser.includes("@") ? cleanUser : `${cleanUser}@se.com`;

    if (provider === "admin" || provider === "credentials") {
      const user = await prisma.user.findUnique({
        where: { email: targetEmail },
      });

      if (!user || !user.password) {
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
      }

      const token = createToken({ userId: user.id, email: user.email, role: user.role });
      const userObj = {
        id: user.id,
        employee_code: user.employeeCode || `SE-ENG-101`,
        name: user.name || "Schneider User",
        email: user.email,
        role: user.role,
        department: user.department || "Schneider Electric Field Engineering",
        avatar: user.avatar || user.image || "/images/user/user.png",
        authProvider: "admin_credentials",
      };

      const response = NextResponse.json({ success: true, user: userObj, token });
      response.cookies.set("auth_token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          actor: user.name || user.email,
          action: `${user.role.toUpperCase()}_LOGIN`,
          details: `User ${user.email} logged in successfully via credentials.`,
        },
      });

      return response;
    }

    if (provider === "google" || provider === "github") {
      if (!email) {
        return NextResponse.json({ success: false, error: "Email is required for SSO lookup" }, { status: 400 });
      }

      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: username || email.split("@")[0],
            role: "engineer",
            department: "Schneider Electric Field Engineering",
          },
        });
      }

      const token = createToken({ userId: user.id, email: user.email, role: user.role });
      const userObj = {
        id: user.id,
        employee_code: user.employeeCode || `SE-ENG-101`,
        name: user.name || "Schneider User",
        email: user.email,
        role: user.role,
        department: user.department || "Schneider Electric Field Engineering",
        avatar: user.avatar || user.image || "/images/user/user.png",
        authProvider: provider,
      };

      const response = NextResponse.json({ success: true, user: userObj, token });
      response.cookies.set("auth_token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      return response;
    }

    return NextResponse.json({ success: false, error: "Invalid auth provider specified" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
