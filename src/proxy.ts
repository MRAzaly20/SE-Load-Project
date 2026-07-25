import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    const hasAuthCookie =
      req.cookies.has("next-auth.session-token") ||
      req.cookies.has("__Secure-next-auth.session-token") ||
      req.cookies.has("auth_token");

    const isLoggedIn = !!token || hasAuthCookie;
    const isSignInPage = req.nextUrl.pathname === "/signin" || req.nextUrl.pathname.startsWith("/signin");

    if (isSignInPage) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: () => true,
    },
    pages: {
      signIn: "/signin",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|admin-signin|signup).*)",
  ],
};