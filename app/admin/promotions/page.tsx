"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";

export default function PromotionsPage() {
  const router = useRouter();

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

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full">
      <PageHeader 
        title="Promotions & Coupons" 
        description="Manage active marketing campaigns, coupon codes, and automated discounts."
      />

      <FilterBar 
        placeholder="Search by promotion name or code..." 
        filters={filters} 
      />

      <DataTable 
        data={promotions}
        columns={columns}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => console.log("Navigate to", row.id)}
        pagination={{ currentPage: 1, totalPages: 1 }}
      />
    </div>
  );
}
