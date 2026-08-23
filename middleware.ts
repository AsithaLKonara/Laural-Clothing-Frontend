import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("laural_token")?.value;
  const role = request.cookies.get("laural_role")?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isBranchAdminRoute = pathname.startsWith("/branch-admin");
  const isPosRoute = pathname.startsWith("/pos");
  const isAccountRoute = pathname.startsWith("/account");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  const isStaffRoute = isAdminRoute || isBranchAdminRoute || isPosRoute;

  // 1. Unauthenticated user trying to access protected routes
  if (isStaffRoute || isAccountRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Strict isolation: PUBLIC_USER attempting to access Admin, Branch Admin, or POS routes
  if (isStaffRoute && token) {
    const isPublicUser = !role || role === "PUBLIC_USER" || role === "Public User" || role.toUpperCase() === "CUSTOMER";
    if (isPublicUser) {
      // Forbidden: redirect to customer account area
      const forbiddenUrl = new URL("/account", request.url);
      forbiddenUrl.searchParams.set("error", "unauthorized_area");
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  // 3. Authenticated user visiting /login
  if (isAuthRoute && token) {
    const isPublicUser = !role || role === "PUBLIC_USER" || role === "Public User";
    const redirectTarget = isPublicUser ? "/account" : "/admin";
    return NextResponse.redirect(new URL(redirectTarget, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/branch-admin/:path*",
    "/pos/:path*",
    "/account/:path*",
    "/login",
    "/register",
  ],
};
