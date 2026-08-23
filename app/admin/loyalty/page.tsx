"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";

export default function LoyaltyPage() {

  const members = [
    { customer: "Kasun Perera", phone: "0771234567", points: "2,450", tier: "Gold", lastActivity: "2 days ago" },
    { customer: "Nethmi", phone: "0719876543", points: "820", tier: "Silver", lastActivity: "1 week ago" },
    { customer: "Dilshan", phone: "0763456789", points: "150", tier: "Bronze", lastActivity: "Today" },
    { customer: "Guest User", phone: "0725551234", points: "0", tier: "Bronze", lastActivity: "1 month ago" },
  ];

  const columns = [
    { header: "Customer", accessor: "customer" as const, className: "font-semibold text-stone-900" },
    { header: "Phone", accessor: "phone" as const, className: "font-mono" },
    { header: "Points", accessor: "points" as const, className: "font-bold text-violet-600" },
    { 
      header: "Tier", 
      accessor: (row: any) => {
        let variant: 'success' | 'warning' | 'neutral' = 'neutral';
        if (row.tier === 'Gold') variant = 'warning'; // Amber for Gold
        if (row.tier === 'Silver') variant = 'neutral';
        return <StatusBadge label={row.tier} variant={variant} />;
      }
    },
    { header: "Last Activity", accessor: "lastActivity" as const },
  ];

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-8">
      
      <PageHeader 
        title="Loyalty Program" 
        description="Manage rewards, customer tiers, and points distribution."
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Members" value="12,450" trend="↑ 182 this week" trendType="positive" />
        <StatCard label="Points Issued" value="482,500" trend="All time" trendType="neutral" />
        <StatCard label="Points Redeemed" value="310,200" trend="64% Redemption rate" trendType="positive" />
        <StatCard label="Outstanding Liability" value="Rs. 172K" trend="Estimated cost" trendType="neutral" />
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden mt-2">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <h3 className="font-bold text-stone-900 font-inter">Loyalty Members</h3>
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="border border-stone-200 rounded-md px-3 py-1.5 text-xs font-inter w-64" 
          />
        </div>
        <DataTable 
          data={members}
          columns={columns}
          keyExtractor={(row) => row.phone}
          pagination={{ currentPage: 1, totalPages: 24 }}
        />
      </div>

    </div>
  );
}
