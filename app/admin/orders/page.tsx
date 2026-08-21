"use client";
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { OrderStatusBadge, BranchBadge, PaymentGatewayBadge } from "@/components/dashboard/Badges";
import CourierLabelModal from "@/components/admin/CourierLabelModal";
import FardarDispatchModal from "@/components/admin/FardarDispatchModal";
import { Printer, Truck, Plus } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import Link from "next/link";

export default function OrdersPage() {
  const router = useRouter();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showFardarModal, setShowFardarModal] = useState(false);

  const { data: orders = [], isLoading: ordersLoading } = useOrders();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]);
  };

  const columns = [
    {
      header: <input type="checkbox" checked={selectedOrders.length === orders.length && orders.length > 0} onChange={handleSelectAll} className="rounded text-stone-900 focus:ring-stone-900 border-stone-300" />,
      accessor: (row: any) => <input type="checkbox" checked={selectedOrders.includes(row.id)} onChange={() => handleSelectOne(row.id)} onClick={e => e.stopPropagation()} className="rounded text-stone-900 focus:ring-stone-900 border-stone-300" />
    },
    { header: "Order", accessor: "id" as const },
    { header: "Customer", accessor: "customer" as const },
    { 
      header: "Branch", 
      accessor: (row: any) => <BranchBadge branch={row.branch} /> 
    },
    { header: "Total", accessor: "total" as const },
    { 
      header: "Payment", 
      accessor: (row: any) => <PaymentGatewayBadge gateway={row.gateway} status={row.status.toLowerCase()} /> 
    },
    { 
      header: "Status", 
      accessor: (row: any) => <OrderStatusBadge status={row.orderStatus} /> 
    },
  ];

  const filters = (
    <>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>All Statuses</option>
        <option>Paid</option>
        <option>Pending</option>
        <option>Failed</option>
      </select>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>All Branches</option>
        <option>Online</option>
        <option>Colombo</option>
        <option>Kandy</option>
      </select>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>All Gateways</option>
        <option>Koko</option>
        <option>Mintpay</option>
        <option>OnePay</option>
        <option>Payzy</option>
        <option>COD</option>
      </select>
    </>
  );

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <PageHeader 
          title="Orders" 
          description="Manage and track all customer orders across channels."
        />
        <Link 
          href="/admin/orders/quick-dispatch"
          className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg font-inter font-medium text-sm hover:bg-stone-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} /> Quick Dispatch
        </Link>
      </div>

      <FilterBar 
        placeholder="Search order, phone, customer, tracking..." 
        filters={filters} 
      />

      <DataTable 
        data={orders}
        columns={columns}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => router.push(`/admin/orders/${row.id}`)}
        pagination={{ currentPage: 1, totalPages: 12 }}
      />

      {/* Floating Bulk Action Bar */}
      {selectedOrders.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10 z-40">
          <span className="font-inter font-medium text-sm">{selectedOrders.length} selected</span>
          <div className="w-px h-6 bg-stone-700"></div>
          <button onClick={() => setShowLabelModal(true)} className="font-inter font-semibold text-sm bg-white text-stone-900 px-4 py-2 rounded-full hover:bg-stone-100 transition-colors flex items-center gap-2">
            <Printer size={14} /> Print Courier Labels
          </button>
          <button onClick={() => setShowFardarModal(true)} className="font-inter font-semibold text-sm bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition-colors flex items-center gap-2">
            <Truck size={14} /> Dispatch via Fardar
          </button>
        </div>
      )}

      {showLabelModal && (
        <CourierLabelModal 
          orders={orders.filter(o => selectedOrders.includes(o.id)).map(o => ({
            id: o.id,
            customer: o.customer,
            address: "123 Sample St, Colombo 03, Sri Lanka", // Dummy data
            phone: "+94 77 123 4567", // Dummy data
            itemsCount: 2, // Dummy data
            weight: "1.2 kg" // Dummy data
          }))}
          onClose={() => setShowLabelModal(false)}
        />
      )}

      {showFardarModal && (
        <FardarDispatchModal 
          orderIds={orders.filter(o => selectedOrders.includes(o.id)).map(o => o.id)}
          onClose={() => setShowFardarModal(false)}
          onSuccess={() => {
            setShowFardarModal(false);
            setSelectedOrders([]);
          }}
        />
      )}
    </div>
  );
}
