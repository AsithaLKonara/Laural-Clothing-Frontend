"use client";

import { X, Search, UserPlus, Phone, User } from "lucide-react";
import { useState } from "react";

export default function CustomerSelectionModal({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-[500px] h-[600px] bg-background shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border bg-surface shrink-0">
          <h3 className="font-inter font-bold text-lg text-foreground">
            {isCreating ? 'Create New Customer' : 'Select Customer'}
          </h3>
          <button onClick={onClose} className="p-2 text-muted hover:text-foreground hover:bg-background rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {!isCreating ? (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-border bg-surface shrink-0">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="text" 
                  placeholder="Search by name, phone, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 font-inter text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {/* Dummy Results */}
              <button className="w-full flex items-center gap-4 p-3 hover:bg-surface rounded-xl transition-colors text-left border border-transparent hover:border-border">
                <div className="w-10 h-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold">
                  JS
                </div>
                <div className="flex flex-col">
                  <span className="font-inter font-bold text-sm text-foreground">Jane Smith</span>
                  <span className="font-inter text-xs text-muted">077 123 4567</span>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 p-3 hover:bg-surface rounded-xl transition-colors text-left border border-transparent hover:border-border">
                <div className="w-10 h-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold">
                  DP
                </div>
                <div className="flex flex-col">
                  <span className="font-inter font-bold text-sm text-foreground">David Perera</span>
                  <span className="font-inter text-xs text-muted">071 987 6543</span>
                </div>
              </button>
            </div>

            <div className="p-4 border-t border-border bg-surface shrink-0">
              <button 
                onClick={() => setIsCreating(true)}
                className="w-full py-3 flex items-center justify-center gap-2 bg-background border border-border hover:border-primary hover:text-primary text-foreground rounded-xl font-inter font-semibold text-sm transition-colors"
              >
                <UserPlus size={18} />
                Create New Customer
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-inter font-semibold text-sm text-foreground">First Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input type="text" className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 font-inter text-sm text-foreground focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-inter font-semibold text-sm text-foreground">Last Name</label>
                <input type="text" className="w-full bg-surface border border-border rounded-xl py-3 px-4 font-inter text-sm text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-inter font-semibold text-sm text-foreground">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input type="tel" className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 font-inter text-sm text-foreground focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-inter font-semibold text-sm text-foreground">Email (Optional)</label>
                <input type="email" className="w-full bg-surface border border-border rounded-xl py-3 px-4 font-inter text-sm text-foreground focus:outline-none focus:border-primary" />
              </div>
            </div>
            
            <div className="p-4 border-t border-border bg-surface shrink-0 flex gap-3">
              <button 
                onClick={() => setIsCreating(false)}
                className="flex-1 py-3 flex items-center justify-center bg-background border border-border hover:bg-surface text-foreground rounded-xl font-inter font-semibold text-sm transition-colors"
              >
                Back to Search
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-3 flex items-center justify-center bg-primary hover:bg-primary-hover text-white rounded-xl font-inter font-bold text-sm transition-colors shadow-md"
              >
                Save & Select
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
