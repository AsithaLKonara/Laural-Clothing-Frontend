"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { OrderStatusBadge } from "@/components/dashboard/Badges";
import { useState } from "react";
import StockTransferModal from "@/components/admin/StockTransferModal";
import InventoryAdjustmentModal from "@/components/admin/InventoryAdjustmentModal";
import { ArrowRightLeft, AlertTriangle, PackagePlus } from "lucide-react";

export default function InventoryPage() {
  const [activeBranch, setActiveBranch] = useState("All Branches");
  const [activeTab, setActiveTab] = useState("Stock Levels");
  
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"receive" | "deduct" | null>(null);

  const tabs = ["Stock Levels", "Transfers", "Adjustments"];

  const inventory = [
    { sku: "LC-TSH-001-M", product: "Black Oversized T-Shirt (M)", branch: "Colombo", stock: 12, reserved: 2, sellable: 10, value: "Rs. 30,000" },
    { sku: "LC-SHT-042-L", product: "Classic Linen Shirt (L)", branch: "Kandy", stock: 1, reserved: 1, sellable: 0, value: "Rs. 4,900" },
    { sku: "LC-DRS-018-S", product: "Summer Floral Dress (S)", branch: "Colombo", stock: 3, reserved: 0, sellable: 3, value: "Rs. 19,500" },
    { sku: "LC-PNT-092-32", product: "Cargo Pants (32)", branch: "Online", stock: 45, reserved: 5, sellable: 40, value: "Rs. 234,000" },
  ];

  const transfers = [
    { id: "TRF-9281", from: "Colombo", to: "Kandy", sku: "LC-TSH-001-M", qty: 5, status: "Pending", requestedBy: "Kasun", date: "Today 10:30 AM" },
    { id: "TRF-9280", from: "Online", to: "Colombo", sku: "LC-PNT-092-32", qty: 20, status: "Dispatched", requestedBy: "Nethmi", date: "Yesterday" },
    { id: "TRF-9275", from: "Kandy", to: "Online", sku: "LC-DRS-018-S", qty: 2, status: "Received", requestedBy: "System", date: "2 Days Ago" },
  ];

  const adjustments = [
    { id: "ADJ-812", type: "Receive", branch: "Online", sku: "LC-TSH-001-M", qty: "+50", reason: "PO-2026-08-12-A", date: "Today 09:15 AM" },
    { id: "ADJ-811", type: "Deduct", branch: "Colombo", sku: "LC-SHT-042-L", qty: "-1", reason: "Damage (In Store)", date: "Yesterday" },
    { id: "ADJ-810", type: "Deduct", branch: "Kandy", sku: "LC-DRS-018-S", qty: "-2", reason: "Theft", date: "Last Week" },
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
  const transferColumns = [
    { header: "Transfer ID", accessor: "id" as const, className: "font-mono font-medium text-blue-600" },
    { header: "From", accessor: "from" as const },
    { header: "To", accessor: "to" as const },
    { header: "SKU", accessor: "sku" as const, className: "font-mono text-xs" },
    { header: "Qty", accessor: "qty" as const, className: "font-bold" },
    { header: "Requested By", accessor: "requestedBy" as const },
    { header: "Status", accessor: (row: any) => <OrderStatusBadge status={row.status} /> },
    { header: "Date", accessor: "date" as const, className: "text-stone-500 text-xs" },
  ];

  const adjustmentColumns = [
    { header: "Ref ID", accessor: "id" as const, className: "font-mono font-medium" },
    { 
      header: "Type", 
      accessor: (row: any) => (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${row.type === 'Receive' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {row.type}
        </span>
      ) 
    },
    { header: "Branch", accessor: "branch" as const },
    { header: "SKU", accessor: "sku" as const, className: "font-mono text-xs" },
    { 
      header: "Qty", 
      accessor: (row: any) => (
        <span className={`font-bold ${row.type === 'Receive' ? 'text-emerald-600' : 'text-red-600'}`}>{row.qty}</span>
      ) 
    },
    { header: "Reason / PO", accessor: "reason" as const, className: "text-stone-500 text-sm" },
    { header: "Date", accessor: "date" as const, className: "text-stone-500 text-xs" },
  ];

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-8">
      
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

      <div className="flex border-b border-stone-200 mt-2">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-inter text-sm font-medium transition-colors ${
              activeTab === tab 
                ? "border-b-2 border-stone-900 text-stone-900" 
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Tab Actions */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <h3 className="font-bold text-stone-900 font-inter">{activeTab}</h3>
          
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Search..." 
              className="border border-stone-200 rounded-md px-3 py-1.5 text-xs font-inter w-64 focus:ring-1 focus:ring-stone-900 outline-none" 
            />
            
            {activeTab === "Transfers" && (
              <button 
                onClick={() => setShowTransferModal(true)}
                className="flex items-center gap-2 px-4 py-1.5 bg-stone-900 text-white rounded-md text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                <ArrowRightLeft size={14} /> Request Transfer
              </button>
            )}

            {activeTab === "Adjustments" && (
              <>
                <button 
                  onClick={() => setAdjustmentType("receive")}
                  className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white rounded-md text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  <PackagePlus size={14} /> Receive Stock
                </button>
                <button 
                  onClick={() => setAdjustmentType("deduct")}
                  className="flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white rounded-md text-xs font-semibold hover:bg-red-700 transition-colors"
                >
                  <AlertTriangle size={14} /> Report Damage
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "Stock Levels" && (
          <DataTable 
            data={inventory}
            columns={columns}
            keyExtractor={(row) => row.sku}
            pagination={{ currentPage: 1, totalPages: 14 }}
          />
        )}
        
        {activeTab === "Transfers" && (
          <DataTable 
            data={transfers}
            columns={transferColumns}
            keyExtractor={(row) => row.id}
            pagination={{ currentPage: 1, totalPages: 2 }}
          />
        )}

        {activeTab === "Adjustments" && (
          <DataTable 
            data={adjustments}
            columns={adjustmentColumns}
            keyExtractor={(row) => row.id}
            pagination={{ currentPage: 1, totalPages: 5 }}
          />
        )}

      </div>

      {/* Modals */}
      {showTransferModal && <StockTransferModal onClose={() => setShowTransferModal(false)} onSuccess={() => setShowTransferModal(false)} />}
      {adjustmentType && <InventoryAdjustmentModal type={adjustmentType} onClose={() => setAdjustmentType(null)} onSuccess={() => setAdjustmentType(null)} />}

    </div>
  );
}
