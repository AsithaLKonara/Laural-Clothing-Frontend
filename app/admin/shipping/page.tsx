"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import StatCard from "@/components/dashboard/StatCard";
import FilterBar from "@/components/dashboard/FilterBar";
import { OrderStatusBadge } from "@/components/dashboard/Badges";
import { Truck } from "lucide-react";

export default function ShippingPage() {
  const [activeTab, setActiveTab] = useState("Pending Dispatch");

  const shipments = [
    { orderId: "LC-10241", customer: "Kasun Perera", trackingId: "-", status: "Pending Dispatch", courier: "Fardar", address: "Kandy", created: "Today 12:42 PM" },
    { orderId: "LC-10240", customer: "Nethmi", trackingId: "-", status: "Pending Dispatch", courier: "Fardar", address: "Colombo 03", created: "Today 01:15 PM" },
    { orderId: "LC-10238", customer: "Dilshan", trackingId: "FDR-8293910", status: "In Transit", courier: "Fardar", address: "Gampaha", created: "Yesterday" },
    { orderId: "LC-10237", customer: "Anu", trackingId: "FDR-8293902", status: "Exception", courier: "Fardar", address: "Colombo 10", created: "Yesterday" },
    { orderId: "LC-10230", customer: "Sanduni", trackingId: "FDR-8293881", status: "Delivered", courier: "Fardar", address: "Nugegoda", created: "2 Days Ago" },
  ];

  const filteredShipments = shipments.filter(s => {
    if (activeTab === "All") return true;
    return s.status === activeTab;
  });

  const columns = [
    { header: "Order", accessor: "orderId" as const, className: "font-semibold text-blue-600 hover:underline cursor-pointer" },
    { header: "Customer", accessor: "customer" as const },
    { header: "Address (City)", accessor: "address" as const },
    { header: "Courier", accessor: () => <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-stone-100 text-stone-700 rounded-md"><Truck size={12}/> Fardar</span> },
    { header: "Tracking ID", accessor: "trackingId" as const, className: "font-mono text-stone-500 text-xs" },
    { 
      header: "Status", 
      accessor: (row: any) => {
        if (row.status === "Pending Dispatch") return <OrderStatusBadge status="Pending" />;
        if (row.status === "In Transit") return <OrderStatusBadge status="Processing" />;
        if (row.status === "Exception") return <OrderStatusBadge status="Failed" />;
        if (row.status === "Delivered") return <OrderStatusBadge status="Paid" />;
        return <OrderStatusBadge status={row.status} />;
      } 
    },
    { header: "Created", accessor: "created" as const, className: "text-stone-500 text-xs font-inter" },
  ];

  const tabs = ["Pending Dispatch", "In Transit", "Exception", "Delivered", "All"];

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-8">
      
      <PageHeader 
        title="Shipping & Logistics" 
        description="Manage the Fardar courier queue, track shipments, and resolve delivery exceptions."
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Pending Dispatch" value="12" trend="Fardar pickup today" trendType="neutral" />
        <StatCard label="In Transit" value="34" />
        <StatCard label="Delivered Today" value="8" trend="↑ 4" trendType="positive" />
        <StatCard label="Exceptions" value="2" trend="Action required" trendType="negative" />
      </div>

      <div className="flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex border-b border-stone-200">
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

        <FilterBar placeholder="Search by Order ID, Tracking ID, or Customer..." />

        {/* Shipments Table */}
        <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
          <DataTable 
            data={filteredShipments}
            columns={columns}
            keyExtractor={(row) => row.orderId}
            pagination={{ currentPage: 1, totalPages: 1 }}
          />
        </div>
      </div>
    </div>
  );
}
