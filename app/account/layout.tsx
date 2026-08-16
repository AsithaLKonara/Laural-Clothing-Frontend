import AccountSidebar from "@/components/AccountSidebar";

export default function CustomerAccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-stone-50 text-stone-900 min-h-screen flex flex-col">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 md:py-12 flex flex-col md:flex-row gap-6 md:gap-12 w-full flex-1">
        
        {/* Account Sidebar */}
        <AccountSidebar />

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>

      </div>
    </div>
  );
}
