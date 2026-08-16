import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";

export const metadata = {
  title: "Super Admin Dashboard - Laural Clothing",
  description: "Operations management for Laural Clothing.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  );
}
