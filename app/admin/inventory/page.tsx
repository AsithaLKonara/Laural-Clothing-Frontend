"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { OrderStatusBadge } from "@/components/dashboard/Badges";
import { useState } from "react";
import StockTransferModal from "@/components/admin/StockTransferModal";
import InventoryAdjustmentModal from "@/components/admin/InventoryAdjustmentModal";
import { ArrowRightLeft, AlertTriangle, PackagePlus, RefreshCw } from "lucide-react";
import {
  useInventory,
  useInventoryStats,
  useInventoryTransactions,
  useTransfers,
} from "@/hooks/useInventory";

export default function InventoryPage() {
  const [activeBranch, setActiveBranch] = useState("All Branches");
  const [activeTab, setActiveTab] = useState("Stock Levels");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"receive" | "deduct" | null>(null);

  const tabs = ["Stock Levels", "Transfers", "Adjustments"];

  // — API hooks —
  const { data: statsData } = useInventoryStats();
  const { data: inventoryData, isLoading: invLoading } = useInventory({ search, page });
  const { data: txData, isLoading: txLoading } = useInventoryTransactions({ page });
  const { data: transferData, isLoading: trLoading } = useTransfers({ page });

  const formatCurrency = (n: number) =>
    `Rs. ${n.toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;

  // — Table column definitions —
  const inventoryColumns = [
    { header: "SKU", accessor: (row: any) => <span className="font-mono text-xs font-medium">{row.sku}</span> },
    {
      header: "Product / Variant",
      accessor: (row: any) => (
        <div>
          <p className="font-inter font-medium text-stone-900 text-sm">{row.productName}</p>
          <p className="font-inter text-xs text-stone-400">{row.name}</p>
        </div>
      ),
    },
    {
      header: "Total Stock",
      accessor: (row: any) => (
        <span className={row.isOutOfStock ? "text-red-600 font-bold" : row.isLowStock ? "text-amber-600 font-bold" : "text-stone-900"}>
          {row.quantity}
        </span>
      ),
    },
    { header: "Reserved", accessor: (row: any) => <span className="text-stone-500">{row.reservedQty}</span> },
    {
      header: "Sellable",
      accessor: (row: any) => (
        <span className="bg-stone-100 px-2 py-1 rounded font-bold text-stone-900">{row.sellable}</span>
      ),
    },
    {
      header: "Status",
      accessor: (row: any) => {
        const statusMap: Record<string, string> = {
          instock: "Active",
          lowstock: "Low Stock",
          outofstock: "Cancelled",
        };
        return <OrderStatusBadge status={statusMap[row.stockStatus] ?? row.stockStatus} />;
      },
    },
    {
      header: "Value",
      accessor: (row: any) => (
        <span className="text-stone-600 text-sm">{formatCurrency(row.quantity * row.price)}</span>
      ),
    },
  ];

  const txColumns = [
    { header: "Type", accessor: (row: any) => (
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${
        row.type === "RECEIVE" || row.type === "TRANSFER_IN" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}>{row.type}</span>
    )},
    { header: "SKU", accessor: (row: any) => <span className="font-mono text-xs">{row.variant?.sku ?? "—"}</span> },
    { header: "Product", accessor: (row: any) => <span className="text-sm">{row.variant?.product?.name ?? "—"}</span> },
    { header: "Qty Change", accessor: (row: any) => (
      <span className={`font-bold ${row.quantityChange > 0 ? "text-emerald-600" : "text-red-600"}`}>
        {row.quantityChange > 0 ? `+${row.quantityChange}` : row.quantityChange}
      </span>
    )},
    { header: "Reason / Reference", accessor: (row: any) => <span className="text-stone-500 text-sm">{row.reason ?? row.reference ?? "—"}</span> },
    { header: "Date", accessor: (row: any) => <span className="text-stone-400 text-xs">{new Date(row.createdAt).toLocaleString()}</span> },
  ];

  const transferColumns = [
    { header: "Transfer ID", accessor: (row: any) => <span className="font-mono text-xs text-blue-600">{row.id.slice(0, 8).toUpperCase()}</span> },
    { header: "From", accessor: "fromLocation" as const },
    { header: "To", accessor: "toLocation" as const },
    { header: "SKU", accessor: (row: any) => <span className="font-mono text-xs">{row.variant?.sku ?? "—"}</span> },
    { header: "Qty", accessor: (row: any) => <span className="font-bold">{row.quantity}</span> },
    { header: "Requested By", accessor: (row: any) => row.requestedBy ?? "—" },
    { header: "Status", accessor: (row: any) => <OrderStatusBadge status={row.status} /> },
    { header: "Date", accessor: (row: any) => <span className="text-stone-400 text-xs">{new Date(row.createdAt).toLocaleString()}</span> },
  ];

  const invMeta = inventoryData?.meta;
  const txMeta = txData?.meta;
  const trMeta = transferData?.meta;

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
        <StatCard label="Total Stock Units" value={statsData?.totalItems?.toLocaleString() ?? "—"} trend={`${statsData?.totalSKUs ?? "—"} SKUs total`} trendType="neutral" />
        <StatCard label="Low Stock SKUs" value={String(statsData?.lowStockCount ?? "—")} trend="Needs reorder" trendType="negative" />
        <StatCard label="Out of Stock" value={String(statsData?.outOfStockCount ?? "—")} trend="Critical" trendType="negative" />
        <StatCard label="Inventory Value" value={statsData ? formatCurrency(statsData.estimatedValue) : "—"} trend="Estimated" trendType="neutral" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mt-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); setSearch(""); }}
            className={`px-6 py-3 font-inter text-sm font-medium transition-colors ${
              activeTab === tab ? "border-b-2 border-stone-900 text-stone-900" : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        {/* Tab toolbar */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-bold text-stone-900 font-inter">{activeTab}</h3>
          <div className="flex items-center gap-3 flex-wrap">
            {activeTab === "Stock Levels" && (
              <input
                type="text"
                placeholder="Search SKU or product..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="border border-stone-200 rounded-md px-3 py-1.5 text-xs font-inter w-64 focus:ring-1 focus:ring-stone-900 outline-none"
              />
            )}

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

        {/* Tab content */}
        {activeTab === "Stock Levels" && (
          invLoading
            ? <div className="flex items-center justify-center py-16 gap-3 text-stone-400"><RefreshCw size={18} className="animate-spin" /> Loading inventory...</div>
            : <DataTable
                data={inventoryData?.data ?? []}
                columns={inventoryColumns}
                keyExtractor={(row: any) => row.variantId}
                pagination={{ currentPage: page, totalPages: invMeta?.totalPages ?? 1 }}
              />
        )}

        {activeTab === "Adjustments" && (
          txLoading
            ? <div className="flex items-center justify-center py-16 gap-3 text-stone-400"><RefreshCw size={18} className="animate-spin" /> Loading transactions...</div>
            : <DataTable
                data={txData?.data ?? []}
                columns={txColumns}
                keyExtractor={(row: any) => row.id}
                pagination={{ currentPage: page, totalPages: txMeta?.totalPages ?? 1 }}
              />
        )}

        {activeTab === "Transfers" && (
          trLoading
            ? <div className="flex items-center justify-center py-16 gap-3 text-stone-400"><RefreshCw size={18} className="animate-spin" /> Loading transfers...</div>
            : <DataTable
                data={transferData?.data ?? []}
                columns={transferColumns}
                keyExtractor={(row: any) => row.id}
                pagination={{ currentPage: page, totalPages: trMeta?.totalPages ?? 1 }}
              />
        )}
      </div>

      {/* Modals */}
      {showTransferModal && (
        <StockTransferModal
          onClose={() => setShowTransferModal(false)}
          onSuccess={() => setShowTransferModal(false)}
        />
      )}
      {adjustmentType && (
        <InventoryAdjustmentModal
          type={adjustmentType}
          onClose={() => setAdjustmentType(null)}
          onSuccess={() => setAdjustmentType(null)}
        />
      )}
    </div>
  );
}
