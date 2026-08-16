"use client";

import { Package, Box, Filter, Search, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const DUMMY_ORDERS = [
  {
    id: "LC-10241",
    date: "2026-08-14",
    status: "PROCESSING", // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    items: 2,
    total: "LKR 8,500",
    payment: "Koko",
    icon: Package
  },
  {
    id: "LC-09942",
    date: "2026-07-28",
    status: "DELIVERED",
    items: 1,
    total: "LKR 4,900",
    payment: "Mintpay",
    icon: Box
  },
  {
    id: "LC-09855",
    date: "2026-06-15",
    status: "DELIVERED",
    items: 4,
    total: "LKR 15,200",
    payment: "Payzy",
    icon: Package
  }
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "PENDING":
      return { color: "text-orange-800", bg: "bg-orange-100", label: "Pending" };
    case "PROCESSING":
      return { color: "text-blue-800", bg: "bg-blue-100", label: "Processing" };
    case "SHIPPED":
      return { color: "text-purple-800", bg: "bg-purple-100", label: "Shipped" };
    case "DELIVERED":
      return { color: "text-emerald-800", bg: "bg-emerald-100", label: "Delivered" };
    case "CANCELLED":
      return { color: "text-red-800", bg: "bg-red-100", label: "Cancelled" };
    default:
      return { color: "text-stone-800", bg: "bg-stone-100", label: status };
  }
};

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");

  const filteredOrders = filter === "all" 
    ? DUMMY_ORDERS 
    : DUMMY_ORDERS.filter(o => o.status.toLowerCase() === filter);

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-inria text-2xl md:text-3xl text-stone-900 mb-1">Order History</h1>
          <p className="font-inter text-sm text-stone-500">View and track all your past orders.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full h-10 pl-9 pr-3 bg-white border border-stone-300 rounded-lg outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          </div>
          <button className="flex items-center justify-center gap-2 px-3 bg-white border border-stone-300 text-stone-700 font-inter font-medium text-sm rounded-lg hover:bg-stone-50 transition-colors shrink-0">
            <Filter size={16} /> <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {["all", "processing", "shipped", "delivered", "cancelled"].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-inter text-sm font-medium rounded-full transition-colors whitespace-nowrap capitalize ${
              filter === f ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-stone-200 border-dashed rounded-xl bg-stone-50">
            <Package className="text-stone-300 mb-4" size={48} />
            <h3 className="font-inria text-xl text-stone-900 mb-2">No Orders Found</h3>
            <p className="font-inter text-stone-500 text-center max-w-sm">
              We couldn't find any orders matching your criteria.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusConfig(order.status);
            const Icon = order.icon;
            
            return (
              <div key={order.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-stone-300 transition-colors flex flex-col md:flex-row">
                {/* Mobile Header / Desktop Left Side */}
                <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-stone-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 shrink-0">
                          <Icon size={18} />
                        </div>
                        <h3 className="font-inter font-bold text-stone-900 text-lg">Order #{order.id}</h3>
                      </div>
                      {/* Status on mobile moves up here for space */}
                      <span className={`md:hidden px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 font-inter text-sm">
                      <div>
                        <p className="text-stone-500 mb-0.5">Date placed</p>
                        <p className="font-medium text-stone-900">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-stone-500 mb-0.5">Total amount</p>
                        <p className="font-medium text-stone-900">{order.total}</p>
                      </div>
                      <div>
                        <p className="text-stone-500 mb-0.5">Items</p>
                        <p className="font-medium text-stone-900">{order.items}</p>
                      </div>
                      <div>
                        <p className="text-stone-500 mb-0.5">Payment</p>
                        <p className="font-medium text-stone-900">{order.payment}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Side */}
                <div className="p-5 md:w-64 bg-stone-50 flex flex-col justify-between">
                  <div className="hidden md:flex justify-end mb-4">
                    <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${statusInfo.bg} ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex flex-row md:flex-col gap-3 h-full justify-end">
                    <Link href={`/account/orders/${order.id}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-stone-300 text-stone-700 font-inter font-medium text-sm rounded-lg hover:bg-stone-100 transition-colors">
                      <Eye size={16} /> View Details
                    </Link>
                    {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                      <button className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 bg-stone-900 text-stone-50 font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors">
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
