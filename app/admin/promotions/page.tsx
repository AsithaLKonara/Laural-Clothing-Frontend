"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";
import { Plus, ChevronDown, Send, Bell, Tag } from "lucide-react";
import BulkMessageModal from "@/components/dashboard/BulkMessageModal";
import PushNotificationModal from "@/components/dashboard/PushNotificationModal";
import CouponModal from "@/components/dashboard/CouponModal";

export default function PromotionsPage() {
  const router = useRouter();
  
  const [showCampaignMenu, setShowCampaignMenu] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [pushModalOpen, setPushModalOpen] = useState(false);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowCampaignMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const promotions = [
    { id: "PRM-001", name: "Summer Sale", code: "SUMMER20", type: "Percentage", value: "20%", usage: "145 / Unlimited", status: "Active", expiry: "2026-08-31" },
    { id: "PRM-002", name: "New User Discount", code: "WELCOME500", type: "Fixed Amount", value: "Rs.500", usage: "32 / 1000", status: "Active", expiry: "No Expiry" },
    { id: "PRM-003", name: "Flash Sale", code: "FLASH50", type: "Percentage", value: "50%", usage: "500 / 500", status: "Expired", expiry: "2026-07-15" },
  ];

  const columns = [
    { header: "Promotion Name", accessor: "name" as const },
    { header: "Code", accessor: "code" as const },
    { header: "Discount Type", accessor: "type" as const },
    { header: "Value", accessor: "value" as const },
    { header: "Usage Limit", accessor: "usage" as const },
    { 
      header: "Status", 
      accessor: (row: any) => (
        <StatusBadge 
          label={row.status} 
          variant={row.status === "Active" ? "success" : "neutral"} 
          dot 
        />
      ) 
    },
    { header: "Expiry Date", accessor: "expiry" as const },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <button 
            className="text-xs text-blue-600 hover:underline font-medium"
            onClick={(e) => { e.stopPropagation(); setEditingCoupon(row); setCouponModalOpen(true); }}
          >
            Edit
          </button>
          <span className="text-stone-300">·</span>
          <button 
            className="text-xs text-red-500 hover:underline font-medium"
            onClick={(e) => { e.stopPropagation(); if(confirm('Delete this coupon?')) { /* delete */ } }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filters = (
    <>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>All Statuses</option>
        <option>Active</option>
        <option>Scheduled</option>
        <option>Expired</option>
      </select>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>All Types</option>
        <option>Percentage</option>
        <option>Fixed Amount</option>
        <option>BOGO</option>
      </select>
    </>
  );

  const pageActions = (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setShowCampaignMenu(!showCampaignMenu)}
        className="bg-stone-900 text-white hover:bg-stone-800 active:scale-95 px-5 py-2 rounded-lg font-inter text-sm font-semibold transition-all whitespace-nowrap shadow-md shadow-stone-900/20 flex items-center gap-2"
      >
        <Plus size={16} /> Create Campaign <ChevronDown size={14} className={`transition-transform ${showCampaignMenu ? "rotate-180" : ""}`} />
      </button>

      {showCampaignMenu && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-[100] flex flex-col p-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <button 
            onClick={() => { setBulkModalOpen(true); setShowCampaignMenu(false); }}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-inter text-stone-700 hover:bg-stone-50 rounded-lg transition-colors text-left"
          >
            <Send size={16} className="text-blue-500" /> Bulk SMS Message
          </button>
          <button 
            onClick={() => { setPushModalOpen(true); setShowCampaignMenu(false); }}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-inter text-stone-700 hover:bg-stone-50 rounded-lg transition-colors text-left"
          >
            <Bell size={16} className="text-amber-500" /> Push Notification
          </button>
          <div className="h-px bg-stone-100 my-1 mx-2"></div>
          <button 
            onClick={() => { setEditingCoupon(null); setCouponModalOpen(true); setShowCampaignMenu(false); }}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-inter text-stone-700 hover:bg-stone-50 rounded-lg transition-colors text-left"
          >
            <Tag size={16} className="text-emerald-500" /> Discount Coupon
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full">
      <PageHeader 
        title="Promotions & Coupons" 
        description="Manage active marketing campaigns, coupon codes, and automated discounts."
        action={pageActions}
      />

      <FilterBar 
        placeholder="Search by promotion name or code..." 
        filters={filters} 
      />

      <DataTable 
        data={promotions}
        columns={columns}
        keyExtractor={(row) => row.id}
        pagination={{ currentPage: 1, totalPages: 1 }}
      />
      
      <BulkMessageModal isOpen={bulkModalOpen} onClose={() => setBulkModalOpen(false)} />
      <PushNotificationModal isOpen={pushModalOpen} onClose={() => setPushModalOpen(false)} />
      <CouponModal 
        isOpen={couponModalOpen} 
        onClose={() => { setCouponModalOpen(false); setEditingCoupon(null); }} 
        initialData={editingCoupon} 
      />
    </div>
  );
}
