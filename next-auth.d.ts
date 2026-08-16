import NextAuth, { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  role: string
  branch: string
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
  interface User {
    role: string
    branch: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    branch: string
  }
}
