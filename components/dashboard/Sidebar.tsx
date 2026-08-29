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
  FileText,
  Layers,
  ArchiveRestore,
  Truck,
  RotateCcw,
  MessageSquare,
  PanelsTopLeft,
  HardDrive,
  X
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean, setIsOpen?: (v: boolean) => void }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { name: "Returns", icon: RotateCcw, href: "/admin/returns" },
    { name: "Shipping", icon: Truck, href: "/admin/shipping" },
    { name: "Products", icon: Box, href: "/admin/products" },
    { name: "Categories", icon: Tags, href: "/admin/categories" },
    { name: "Collections", icon: Layers, href: "/admin/collections" },
    { name: "Inventory", icon: ArchiveRestore, href: "/admin/inventory" },
    { name: "Branches", icon: Store, href: "/admin/branches" },
    { name: "POS", icon: MonitorSmartphone, href: "/pos" },
    { name: "Payments", icon: CreditCard, href: "/admin/payments" },
    { name: "Customers", icon: Users, href: "/admin/customers" },
    { name: "Reviews", icon: MessageSquare, href: "/admin/reviews" },
    { name: "Loyalty", icon: Gift, href: "/admin/loyalty" },
    { name: "Promotions", icon: Megaphone, href: "/admin/promotions" },
    { name: "CMS", icon: PanelsTopLeft, href: "/admin/cms" },
    { name: "Media", icon: HardDrive, href: "/admin/media" },
    { name: "Reports", icon: BarChart3, href: "/admin/reports" },
  ];

  const systemItems = [
    { name: "Access Control", icon: Shield, href: "/admin/system/roles" },
    { name: "Settings", icon: Settings, href: "/admin/system/settings" },
    { name: "Audit Logs", icon: FileText, href: "/admin/system/audit" },
  ];

  return (
    <aside className={`fixed left-0 top-0 bottom-0 w-[224px] bg-surface border-r border-border flex flex-col z-50 text-text-secondary transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Logo Area */}
      <div className="h-[67px] flex items-center justify-between px-6 border-b border-border shrink-0 bg-surface">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-white font-signature text-lg leading-none pt-1 shadow-sm">
            L
          </div>
          <span className="font-inter font-bold tracking-widest text-foreground text-sm uppercase">Laural</span>
        </Link>
        {setIsOpen && (
          <button className="md:hidden text-muted hover:text-foreground" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8 scrollbar-hide">

        {/* Main Nav */}
        <div className="flex flex-col gap-1">
          <span className="px-3 mb-2 font-poppins font-semibold text-[10px] uppercase tracking-wider text-muted">Main Menu</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            // Exact match for /admin, startsWith for other routes
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border-l-4 ${isActive
                    ? "bg-accent-soft text-primary border-primary font-bold shadow-sm"
                    : "border-transparent text-text-secondary hover:bg-background hover:text-foreground font-medium"
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
          <span className="px-3 mb-2 font-poppins font-semibold text-[10px] uppercase tracking-wider text-muted">System</span>
          {systemItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border-l-4 ${isActive
                    ? "bg-accent-soft text-primary border-primary font-bold shadow-sm"
                    : "border-transparent text-text-secondary hover:bg-background hover:text-foreground font-medium"
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
      <div className="p-4 border-t border-border shrink-0 bg-surface">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-background transition-colors cursor-pointer border border-transparent hover:border-border">
          <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-white font-poppins font-semibold text-sm shadow-sm">
            SA
          </div>
          <div className="flex flex-col">
            <span className="font-inter font-semibold text-sm text-foreground leading-tight">Super Admin</span>
            <span className="font-inter text-xs text-muted">System Owner</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
