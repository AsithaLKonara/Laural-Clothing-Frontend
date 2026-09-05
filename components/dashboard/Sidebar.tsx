"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
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
  X,
  LogOut
} from "lucide-react";

interface NavItem {
  name: string;
  icon: any;
  href: string;
  permission?: string | string[];
}

export default function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean, setIsOpen?: (v: boolean) => void }) {
  const pathname = usePathname();
  const { user, hasPermission, hasRole, isSuperAdmin } = useAuthStore();

  const getInitials = (name?: string | null) => {
    if (!name) return "US";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin", permission: ["reports:view_dashboard", "reports:view_financial"] },
    { name: "Orders", icon: ShoppingCart, href: "/admin/orders", permission: "orders:view" },
    { name: "Returns", icon: RotateCcw, href: "/admin/returns", permission: "returns:view" },
    { name: "Shipping", icon: Truck, href: "/admin/shipping", permission: "shipping:view_queue" },
    { name: "Products", icon: Box, href: "/admin/products", permission: "products:view" },
    { name: "Categories", icon: Tags, href: "/admin/categories", permission: ["categories:manage", "products:view"] },
    { name: "Collections", icon: Layers, href: "/admin/collections", permission: ["collections:manage", "products:view"] },
    { name: "Inventory", icon: ArchiveRestore, href: "/admin/inventory", permission: "inventory:view_stock" },
    { name: "Branches", icon: Store, href: "/admin/branches", permission: "branches:view" },
    { name: "POS Sales", icon: MonitorSmartphone, href: "/admin/pos-sales", permission: ["pos:view_sales_history", "pos:sales_mode"] },
    { name: "POS Terminal", icon: MonitorSmartphone, href: "/pos", permission: "pos:sales_mode" },
    { name: "Payments", icon: CreditCard, href: "/admin/payments", permission: "payments:view_transactions" },
    { name: "Customers", icon: Users, href: "/admin/customers", permission: "customers:view" },
    { name: "Reviews", icon: MessageSquare, href: "/admin/reviews", permission: "reviews:view" },
    { name: "Loyalty", icon: Gift, href: "/admin/loyalty", permission: "loyalty:view_points" },
    { name: "Promotions", icon: Megaphone, href: "/admin/promotions", permission: "promotions:view" },
    { name: "CMS", icon: PanelsTopLeft, href: "/admin/cms", permission: "cms:view" },
    { name: "Media", icon: HardDrive, href: "/admin/media", permission: "media:view_library" },
    { name: "Reports", icon: BarChart3, href: "/admin/reports", permission: ["reports:view_dashboard", "reports:view_financial"] },
  ];

  const systemItems: NavItem[] = [
    { name: "Access Control", icon: Shield, href: "/admin/system/roles", permission: ["system:manage_roles", "system:manage_users"] },
    { name: "Settings", icon: Settings, href: "/admin/system/settings", permission: "system:platform_settings" },
    { name: "Audit Logs", icon: FileText, href: "/admin/system/audit", permission: "system:view_audit_logs" },
  ];

  const checkPermission = (perm?: string | string[]) => {
    if (!perm || isSuperAdmin()) return true;
    if (Array.isArray(perm)) {
      return perm.some(p => hasPermission(p));
    }
    return hasPermission(perm);
  };

  const visibleNavItems = navItems.filter(item => checkPermission(item.permission));
  const visibleSystemItems = systemItems.filter(item => checkPermission(item.permission));

  const primaryRole = user?.roles?.[0] || "Staff User";

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
        {visibleNavItems.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="px-3 mb-2 font-poppins font-semibold text-[10px] uppercase tracking-wider text-muted">Main Menu</span>
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
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
        )}

        {/* System Nav */}
        {visibleSystemItems.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="px-3 mb-2 font-poppins font-semibold text-[10px] uppercase tracking-wider text-muted">System</span>
            {visibleSystemItems.map((item) => {
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
        )}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border shrink-0 bg-surface flex items-center justify-between">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-background transition-colors border border-transparent hover:border-border min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-white font-poppins font-semibold text-sm shadow-sm shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-inter font-semibold text-sm text-foreground leading-tight truncate">{user?.name || "Staff Member"}</span>
            <span className="font-inter text-xs text-muted truncate">{primaryRole}</span>
          </div>
        </div>
        <button 
          onClick={() => useAuthStore.getState().logout('/login')}
          className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1 shrink-0"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
