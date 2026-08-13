"use client";

import { Search, Bell, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="h-[64px] bg-surface border-b border-border flex items-center justify-between px-8 shrink-0 shadow-sm z-40">
      
      {/* Left — Breadcrumbs placeholder */}
      <div className="flex items-center gap-2 text-sm text-muted font-inter">
        {/* Dynamic breadcrumbs can be injected here */}
      </div>

      {/* Right — Search + Notif + User */}
      <div className="flex items-center gap-4 ml-auto">
        
        {/* Global Search */}
        <div className="flex items-center gap-2 w-[320px] h-[38px] bg-background border border-border rounded-xl px-3.5 transition-all focus-within:border-primary focus-within:bg-surface focus-within:shadow-sm">
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

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-background transition-colors text-muted">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface shadow-sm"></span>
        </button>

        {/* User Chip */}
        <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-background transition-colors border border-border bg-surface">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-inter font-bold text-[10px]">
            SA
          </div>
          <span className="font-inter font-medium text-sm text-foreground">Super Admin</span>
          <ChevronDown size={14} className="text-muted" />
        </button>

      </div>
    </header>
  );
}
