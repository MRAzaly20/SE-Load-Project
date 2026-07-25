import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Authentication & Authorization Middleware
 * 
 * Protects API routes by:
 * 1. Verifying JWT token exists and is valid
 * 2. Enforcing role-based access control
 * 3. Blocking unauthenticated requests
 */

export async function authMiddleware(
  req: NextRequest,
  options?: {
    requiredRoles?: string[];
    allowPublic?: boolean;
  }
) {
  const { pathname } = req.nextUrl;

  // Skip authentication for public routes
  const publicRoutes = [
    "/api/auth",
    "/signin",
    "/signup",
    "/images",
    "/favicon.ico",
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    // Get JWT token from request
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    });

    // Check if user is authenticated
    if (!token) {
      // Try to get token from cookie as fallback
      const authToken = req.cookies.get("auth_token")?.value;
      if (!authToken) {
        return NextResponse.json(
          {
            success: false,
            error: "Authentication required. Please sign in.",
          },
          { status: 401 }
        );
      }
    }

    // Role-based access control
    if (options?.requiredRoles && options.requiredRoles.length > 0) {
      const userRole = (token?.role as string) || "engineer";

      if (!options.requiredRoles.includes(userRole)) {
        return NextResponse.json(
          {
            success: false,
            error: `Access denied. Required roles: ${options.requiredRoles.join(", ")}`,
          },
          { status: 403 }
        );
      }
    }

    // Admin-only routes check
    if (pathname.startsWith("/api/admin") || pathname.startsWith("/admin")) {
      const userRole = (token?.role as string) || "engineer";
      if (userRole !== "admin") {
        return NextResponse.json(
          {
            success: false,
            error: "Admin access required",
          },
          { status: 403 }
        );
      }
    }

    // Manager or Admin routes
    if (pathname.startsWith("/api/manager") || pathname.startsWith("/manager")) {
      const userRole = (token?.role as string) || "engineer";
      if (userRole !== "manager" && userRole !== "admin") {
        return NextResponse.json(
          {
            success: false,
            error: "Manager or Admin access required",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed",
      },
      { status: 500 }
    );
  }
}

/**
 * Get current user from request
 * Returns null if not authenticated
 */
export async function getCurrentUser(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    });

    if (!token) {
      const authToken = req.cookies.get("auth_token")?.value;
      if (!authToken) {
        return null;
      }
    }

    return {
      id: token?.id as string,
      email: token?.email as string,
      name: token?.name as string,
      role: (token?.role as string) || "engineer",
      department: token?.department as string,
      employeeCode: token?.employeeCode as string,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
