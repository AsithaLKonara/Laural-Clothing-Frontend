import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

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
    <div className="flex h-screen w-full bg-stone-50 overflow-hidden">
      
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col ml-[224px] h-screen overflow-hidden">
        
        {/* Fixed Header */}
        <Header />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>

      </div>
    </div>
  );
}
