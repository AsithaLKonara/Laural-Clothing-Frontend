import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laural Admin Dashboard",
  description: "Admin dashboard for Laural Clothing",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = { user: { name: "Admin User", role: "Super Admin" } };

  return (
    <DashboardLayoutClient session={session}>
      {children}
    </DashboardLayoutClient>
  );
}
