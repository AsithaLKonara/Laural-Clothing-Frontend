import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Mock users based on AccessControlPage
const mockUsers = [
  { id: "USR-001", name: "Asitha Lakmal", email: "asitha@laural.lk", role: "Super Admin", branch: "Global (All Branches)", status: "Active" },
  { id: "USR-002", name: "John Doe", email: "john@laural.lk", role: "Branch Admin", branch: "Colombo Main", status: "Active" },
  { id: "USR-003", name: "Jane Smith", email: "jane@laural.lk", role: "Cashier", branch: "Kandy City Centre", status: "Active" },
  { id: "USR-004", name: "Mark Silva", email: "mark@laural.lk", role: "Inventory Manager", branch: "Gampaha Branch", status: "Suspended" },
];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // This is basic authorized callback. The advanced RBAC logic will be handled in middleware.ts
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnPos = nextUrl.pathname.startsWith("/pos");
      const isOnBranchAdmin = nextUrl.pathname.startsWith("/branch-admin");
      
      const requiresAuth = isOnAdmin || isOnPos || isOnBranchAdmin;

      if (requiresAuth) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async jwt({ token, user }) {
      // Pass role and branch from user to token on initial sign in
      if (user) {
        token.role = user.role;
        token.branch = user.branch;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass role and branch from token to session
      if (session.user) {
        session.user.role = token.role as string;
        session.user.branch = token.branch as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        // Find user by email (in a real app, query DB and check hashed password)
        const user = mockUsers.find((u) => u.email === credentials.email);
        
        if (!user) {
          throw new Error("User not found.");
        }

        if (user.status !== "Active") {
          throw new Error("Account is suspended.");
        }

        // For mock purposes, accept any password
        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
