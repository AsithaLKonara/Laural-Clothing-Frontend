"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Tags, 
  Box, 
  Store, 
  MonitorSmartphone, 
  CreditCard, 
  Users, 
  Gift, 
  Megaphone, 
  BarChart3, 
  UserCog, 
  Shield, 
  Settings, 
  FileText 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { name: "Products", icon: Package, href: "/admin/products" },
    { name: "Categories", icon: Tags, href: "/admin/categories" },
    { name: "Inventory", icon: Box, href: "/admin/inventory" },
    { name: "Branches", icon: Store, href: "/admin/branches" },
    { name: "POS", icon: MonitorSmartphone, href: "/pos" },
    { name: "Payments", icon: CreditCard, href: "/admin/payments" },
    { name: "Customers", icon: Users, href: "/admin/customers" },
    { name: "Loyalty", icon: Gift, href: "/admin/loyalty" },
    { name: "Promotions", icon: Megaphone, href: "/admin/promotions" },
    { name: "Reports", icon: BarChart3, href: "/admin/reports" },
  ];

  const systemItems = [
    { name: "Users", icon: UserCog, href: "/admin/system/users" },
    { name: "Roles", icon: Shield, href: "/admin/system/roles" },
    { name: "Settings", icon: Settings, href: "/admin/system/settings" },
    { name: "Audit Logs", icon: FileText, href: "/admin/system/audit" },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[224px] bg-stone-900 border-r border-stone-800 flex flex-col z-50 text-stone-300">
      {/* Logo Area */}
      <div className="h-[67px] flex items-center px-6 border-b border-stone-800 shrink-0 bg-stone-950/30">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-signature text-lg leading-none pt-1 shadow-lg shadow-accent/20">
            L
          </div>
          <span className="font-inter font-bold tracking-widest text-white text-sm uppercase">Laural</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8 scrollbar-hide">
        
        {/* Main Nav */}
        <div className="flex flex-col gap-1">
          <span className="px-3 mb-2 font-poppins font-semibold text-[10px] uppercase tracking-wider text-stone-500">Main Menu</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            // Exact match for /admin, startsWith for other routes
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? "bg-accent/10 text-accent font-medium shadow-sm" 
                    : "text-stone-400 hover:bg-stone-800 hover:text-white font-medium"
                }`}
              >
                <Icon size={18} />
                <span className="font-inter text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* System Nav */}
        <div className="flex flex-col gap-1">
          <span className="px-3 mb-2 font-poppins font-semibold text-[10px] uppercase tracking-wider text-stone-500">System</span>
          {systemItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? "bg-accent/10 text-accent font-medium shadow-sm" 
                    : "text-stone-400 hover:bg-stone-800 hover:text-white font-medium"
                }`}
              >
                <Icon size={18} />
                <span className="font-inter text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* User Profile Footer */}
      <div className="p-4 border-t border-stone-800 shrink-0 bg-stone-950/30">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-poppins font-semibold text-sm shadow-md shadow-accent/20">
            SA
          </div>
          <div className="flex flex-col">
            <span className="font-inter font-semibold text-sm text-white leading-tight">Super Admin</span>
            <span className="font-inter text-xs text-stone-500">System Owner</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
