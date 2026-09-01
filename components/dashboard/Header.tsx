"use client";

import { Search, Bell, ChevronDown, Menu, LogOut, Check, ShoppingBag, Package, Info, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useNotifications } from "@/hooks/useNotifications";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';

export default function Header({ onMenuClick, session }: { onMenuClick?: () => void, session?: any }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  const getInitials = (name?: string | null) => {
    if (!name) return "US";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };
  return (
    <header className="h-[64px] bg-surface border-b border-border flex items-center justify-between px-4 md:px-8 shrink-0 shadow-sm z-40">
      
      {/* Left — Hamburger & Breadcrumbs placeholder */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button className="md:hidden p-2 -ml-2 text-muted hover:text-foreground hover:bg-background rounded-xl transition-colors" onClick={onMenuClick}>
            <Menu size={20} />
          </button>
        )}
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted font-inter">
          {/* Dynamic breadcrumbs can be injected here */}
        </div>
      </div>

      {/* Right — Search + Notif + User */}
      <div className="flex items-center gap-3 md:gap-4 ml-auto">
        
        {/* Global Search */}
        <div className="hidden md:flex items-center gap-2 w-[320px] h-[38px] bg-background border border-border rounded-xl px-3.5 transition-all focus-within:border-primary focus-within:bg-surface focus-within:shadow-sm">
          <Search size={15} className="text-muted shrink-0" />
          <input 
            type="text" 
            placeholder="Search orders, customers, SKU…"
            className="flex-1 bg-transparent border-none outline-none font-inter text-[13px] text-foreground placeholder:text-muted"
          />
          <kbd className="hidden sm:flex items-center px-1.5 py-0.5 bg-border rounded text-[10px] font-medium text-text-secondary font-inter shrink-0">
            ⌘K
          </kbd>
        </div>
        
        {/* Mobile Search Icon */}
        <button className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-background transition-colors text-muted">
          <Search size={18} />
        </button>

        {/* Notifications */}
        <div className="relative group">
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-background transition-colors text-muted">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-surface shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-border flex items-center justify-between bg-background">
              <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={() => markAllAsRead()} className="text-[11px] text-primary hover:underline font-medium">
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted flex flex-col items-center">
                  <Bell size={24} className="opacity-20 mb-2" />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                notifications.map((notif: any) => (
                  <div 
                    key={notif.id} 
                    className={`p-3 border-b border-border last:border-0 hover:bg-background transition-colors flex gap-3 cursor-pointer ${!notif.isRead ? 'bg-primary/5' : ''}`}
                    onClick={() => {
                      if (!notif.isRead) markAsRead(notif.id);
                      if (notif.link) router.push(notif.link);
                    }}
                  >
                    <div className="mt-0.5 shrink-0">
                      {notif.type === 'ORDER' ? <ShoppingBag size={16} className="text-primary" /> : 
                       notif.type === 'INVENTORY' ? <Package size={16} className="text-warning" /> :
                       notif.type === 'ALERT' ? <AlertTriangle size={16} className="text-error" /> :
                       <Info size={16} className="text-info" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <p className={`text-sm font-medium truncate ${notif.isRead ? 'text-foreground' : 'text-foreground'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-muted shrink-0 whitespace-nowrap">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-[12px] text-muted line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="shrink-0 flex items-center mt-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* User Chip */}
        <div className="relative group">
          <button className="flex items-center gap-2.5 px-2 md:px-3 py-1.5 rounded-xl hover:bg-background transition-colors border border-border bg-surface">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-inter font-bold text-[10px]">
              {getInitials(user?.name || session?.user?.name)}
            </div>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="font-inter font-medium text-sm text-foreground leading-none">{user?.name || session?.user?.name || "Staff User"}</span>
              <span className="font-inter text-[10px] text-muted leading-none mt-1">{user?.roles?.[0] || session?.user?.role || "Staff"}</span>
            </div>
            <ChevronDown size={14} className="text-muted ml-1" />
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50 flex flex-col">
            <button 
              onClick={async () => {
                const { logout } = useAuthStore.getState();
                await logout();
                router.push("/login");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors text-left w-full font-inter"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
