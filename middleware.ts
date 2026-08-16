import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

// Define route access mappings
const POS_ALLOWED_ROLES = ["Cashier", "Branch Admin", "Super Admin"];
const BRANCH_ADMIN_ALLOWED_ROLES = ["Branch Admin", "Super Admin"];
const ADMIN_BLOCKED_ROLES = ["Cashier"]; // Cashiers strictly use POS

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  
  const isOnAdmin = pathname.startsWith("/admin");
  const isOnPos = pathname.startsWith("/pos");
  const isOnBranchAdmin = pathname.startsWith("/branch-admin");
  
  const requiresAuth = isOnAdmin || isOnPos || isOnBranchAdmin;

  // 1. If not logged in but trying to access protected route, redirect to login
  if (requiresAuth && !isLoggedIn) {
    let callbackUrl = pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  // 2. Role-Based Access Control logic for logged-in users
  if (isLoggedIn) {
    const userRole = req.auth?.user?.role as string;
    
    // Redirect logic if user is at /login or / trying to go to their dashboard
    if (pathname === "/login") {
      if (userRole === "Cashier") {
        return Response.redirect(new URL("/pos", nextUrl));
      } else {
        return Response.redirect(new URL("/admin", nextUrl));
      }
    }

    // Protect /pos
    if (isOnPos && !POS_ALLOWED_ROLES.includes(userRole)) {
      return Response.redirect(new URL("/admin", nextUrl));
    }

    // Protect /admin
    if (isOnAdmin && ADMIN_BLOCKED_ROLES.includes(userRole)) {
      return Response.redirect(new URL("/pos", nextUrl));
    }

    // Protect /branch-admin
    if (isOnBranchAdmin && !BRANCH_ADMIN_ALLOWED_ROLES.includes(userRole)) {
      return Response.redirect(new URL("/admin", nextUrl));
    }
  }

  // Allow request to continue
});

export const config = {
  // Matcher ensures middleware only runs on specific paths
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
