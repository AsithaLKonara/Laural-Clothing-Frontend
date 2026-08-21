"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, RotateCcw, AlertCircle, CheckCircle2, Truck, Package, Clock, RefreshCw } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import BulkReturnModal from "@/components/admin/BulkReturnModal";

const DUMMY_RETURNS = [
  { id: "RMA-00124", orderId: "LC-10241", customer: "Kasun Perera", date: "2026-08-14", status: "REQUESTED", amount: "LKR 4,500" },
  { id: "RMA-00123", orderId: "LC-09942", customer: "Amila Silva", date: "2026-08-12", status: "APPROVED", amount: "LKR 12,000" },
  { id: "RMA-00122", orderId: "LC-09855", customer: "Nuwan Jay", date: "2026-08-10", status: "RECEIVED", amount: "LKR 3,200" },
  { id: "RMA-00121", orderId: "LC-09710", customer: "Samadi W.", date: "2026-08-05", status: "REFUNDED", amount: "LKR 8,900" },
  { id: "RMA-00120", orderId: "LC-09601", customer: "Deshan M.", date: "2026-08-01", status: "REJECTED", amount: "LKR 2,100" },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "REQUESTED": return { icon: AlertCircle, bg: "bg-orange-100", color: "text-orange-700", label: "Requested" };
    case "APPROVED": return { icon: Clock, bg: "bg-blue-100", color: "text-blue-700", label: "Awaiting Item" };
    case "IN_TRANSIT": return { icon: Truck, bg: "bg-purple-100", color: "text-purple-700", label: "In Transit" };
    case "RECEIVED": return { icon: Package, bg: "bg-indigo-100", color: "text-indigo-700", label: "Inspecting" };
    case "REFUNDED": return { icon: CheckCircle2, bg: "bg-emerald-100", color: "text-emerald-700", label: "Refunded" };
    case "REJECTED": return { icon: AlertCircle, bg: "bg-red-100", color: "text-red-700", label: "Rejected" };
    default: return { icon: RotateCcw, bg: "bg-stone-100", color: "text-stone-700", label: status };
  }
};

export default function AdminReturnsPage() {
  const [filter, setFilter] = useState("ALL");
  const [selectedRMAs, setSelectedRMAs] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const filteredReturns = filter === "ALL" 
    ? DUMMY_RETURNS 
    : DUMMY_RETURNS.filter(r => r.status === filter);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRMAs(filteredReturns.map(r => r.id));
    } else {
      setSelectedRMAs([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedRMAs(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Returns Management" 
        subtitle="Process online return requests and manage warehouse inspections."
        actionLabel="Export Report"
      />

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-stone-200 rounded-xl shadow-sm">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Search by RMA, Order ID, or Customer..." 
              className="w-full h-10 pl-10 pr-4 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-stone-900 focus:bg-white transition-colors text-sm font-inter"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          </div>
          <button className="flex items-center justify-center w-10 h-10 bg-stone-50 border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-100 transition-colors shrink-0 md:hidden">
            <Filter size={16} />
          </button>
        </div>

        <div className="hidden md:flex gap-2 overflow-x-auto hide-scrollbar">
          {["ALL", "REQUESTED", "APPROVED", "RECEIVED", "REFUNDED"].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-inter text-sm font-medium rounded-lg transition-colors whitespace-nowrap capitalize ${
                filter === f ? "bg-stone-900 text-white" : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {f.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="py-4 px-6 w-12">
                  <input type="checkbox" checked={selectedRMAs.length === filteredReturns.length && filteredReturns.length > 0} onChange={handleSelectAll} className="rounded text-stone-900 focus:ring-stone-900 border-stone-300" />
                </th>
                <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-2">RMA Number</th>
                <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-6">Order ID</th>
                <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-6">Customer</th>
                <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-6">Date</th>
                <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-6">Status</th>
                <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-6 text-right">Amount</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredReturns.map((ret) => {
                const statusInfo = getStatusConfig(ret.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={ret.id} className={`hover:bg-stone-50 transition-colors group ${selectedRMAs.includes(ret.id) ? 'bg-stone-50' : ''}`}>
                    <td className="py-4 px-6">
                      <input type="checkbox" checked={selectedRMAs.includes(ret.id)} onChange={() => handleSelectOne(ret.id)} className="rounded text-stone-900 focus:ring-stone-900 border-stone-300" />
                    </td>
                    <td className="py-4 px-2 font-inter font-medium text-sm text-stone-900">{ret.id}</td>
                    <td className="py-4 px-6 font-inter text-sm text-blue-600 hover:underline cursor-pointer">{ret.orderId}</td>
                    <td className="py-4 px-6 font-inter text-sm text-stone-600">{ret.customer}</td>
                    <td className="py-4 px-6 font-inter text-sm text-stone-500">{ret.date}</td>
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${statusInfo.bg} ${statusInfo.color}`}>
                        <StatusIcon size={14} />
                        {statusInfo.label}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-inter text-sm text-stone-900 text-right font-medium">{ret.amount}</td>
                    <td className="py-4 px-6 text-right">
                      <Link 
                        href={`/admin/returns/${ret.id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-stone-300 text-stone-700 font-inter font-medium text-xs rounded hover:bg-stone-50 transition-colors shadow-sm"
                      >
                        Process
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-stone-200 bg-stone-50/50">
          <span className="font-inter text-sm text-stone-500">
            Showing <span className="font-medium text-stone-900">1</span> to <span className="font-medium text-stone-900">{filteredReturns.length}</span> of <span className="font-medium text-stone-900">{filteredReturns.length}</span> results
          </span>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1.5 bg-white border border-stone-200 text-stone-400 font-inter text-sm rounded-md shadow-sm">Previous</button>
            <button disabled className="px-3 py-1.5 bg-white border border-stone-200 text-stone-400 font-inter text-sm rounded-md shadow-sm">Next</button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedRMAs.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10 z-40">
          <span className="font-inter font-medium text-sm">{selectedRMAs.length} selected</span>
          <div className="w-px h-6 bg-stone-700"></div>
          <button onClick={() => setShowBulkModal(true)} className="font-inter font-semibold text-sm bg-white text-stone-900 px-4 py-2 rounded-full hover:bg-stone-100 transition-colors flex items-center gap-2">
            <RefreshCw size={14} /> Process Bulk Return
          </button>
        </div>
      )}

      {/* Bulk Modal */}
      {showBulkModal && (
        <BulkReturnModal 
          selectedRMAs={filteredReturns.filter(r => selectedRMAs.includes(r.id))}
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => {
            setShowBulkModal(false);
            setSelectedRMAs([]);
          }}
        />
      )}
    </div>
  );
}
