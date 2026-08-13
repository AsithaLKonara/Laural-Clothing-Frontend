"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { useState } from "react";

export default function InventoryPage() {
  const [activeBranch, setActiveBranch] = useState("All Branches");

  const inventory = [
    { sku: "LC-TSH-001-M", product: "Black Oversized T-Shirt (M)", branch: "Colombo", stock: 12, reserved: 2, sellable: 10, value: "Rs. 30,000" },
    { sku: "LC-SHT-042-L", product: "Classic Linen Shirt (L)", branch: "Kandy", stock: 1, reserved: 1, sellable: 0, value: "Rs. 4,900" },
    { sku: "LC-DRS-018-S", product: "Summer Floral Dress (S)", branch: "Colombo", stock: 3, reserved: 0, sellable: 3, value: "Rs. 19,500" },
    { sku: "LC-PNT-092-32", product: "Cargo Pants (32)", branch: "Online", stock: 45, reserved: 5, sellable: 40, value: "Rs. 234,000" },
  ];

  const columns = [
    { header: "SKU", accessor: "sku" as const, className: "font-mono font-medium" },
    { header: "Product", accessor: "product" as const },
    { header: "Branch", accessor: "branch" as const },
    { 
      header: "Available", 
      accessor: (row: any) => (
        <span className={row.sellable <= 3 ? "text-red-600 font-bold" : "text-stone-900"}>{row.stock}</span>
      )
    },
    { header: "Reserved", accessor: "reserved" as const },
    { 
      header: "Sellable", 
      accessor: (row: any) => (
        <span className="bg-stone-100 px-2 py-1 rounded font-bold">{row.sellable}</span>
      )
    },
    { header: "Est. Value", accessor: "value" as const },
  ];

  return (
    <div className="flex flex-col p-10 max-w-[1280px] mx-auto w-full gap-8">
      
      <PageHeader 
        title="Inventory" 
        description="Monitor stock levels, transfers, and valuations across all branches."
        action={
          <select 
            value={activeBranch}
            onChange={(e) => setActiveBranch(e.target.value)}
            className="bg-white border border-stone-200 rounded-lg py-2 px-4 text-sm font-inter text-stone-900 outline-none focus:ring-1 focus:ring-stone-400"
          >
            <option>All Branches</option>
            <option>Online</option>
            <option>Colombo</option>
            <option>Kandy</option>
          </select>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Items" value="12,458" trend="Across all SKUs" trendType="neutral" />
        <StatCard label="Low Stock SKUs" value="48" trend="Needs reorder" trendType="negative" />
        <StatCard label="Out of Stock" value="12" trend="Critical" trendType="negative" />
        <StatCard label="Inventory Value" value="Rs. 4.2M" trend="Estimated" trendType="neutral" />
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden mt-2">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <h3 className="font-bold text-stone-900 font-inter">Stock Levels</h3>
          <input 
            type="text" 
            placeholder="Search SKU..." 
            className="border border-stone-200 rounded-md px-3 py-1.5 text-xs font-inter w-64" 
          />
        </div>
        <DataTable 
          data={inventory}
          columns={columns}
          keyExtractor={(row) => row.sku}
          pagination={{ currentPage: 1, totalPages: 14 }}
        />
      </div>

    </div>
  );
}
