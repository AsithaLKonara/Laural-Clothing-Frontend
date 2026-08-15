"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import StatCard from "@/components/dashboard/StatCard";
import { PaymentGatewayBadge } from "@/components/dashboard/Badges";
import { useState } from "react";

export default function PaymentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");

  const transactions = [
    { id: "TXN-82931", order: "LC-10241", customer: "Kasun", gateway: "Koko", method: "Installment", amount: "Rs. 8,500", status: "Paid", created: "12:42 PM" },
    { id: "TXN-82932", order: "LC-10240", customer: "Nethmi", gateway: "Mintpay", method: "Installment", amount: "Rs. 5,200", status: "Paid", created: "01:15 PM" },
    { id: "TXN-82933", order: "LC-10239", customer: "Guest", gateway: "COD", method: "Cash", amount: "Rs. 3,900", status: "Pending", created: "02:20 PM" },
    { id: "TXN-82934", order: "LC-10238", customer: "Dilshan", gateway: "OnePay", method: "Card", amount: "Rs. 7,800", status: "Paid", created: "03:45 PM" },
    { id: "TXN-82935", order: "LC-10237", customer: "Anu", gateway: "Payzy", method: "Card", amount: "Rs. 9,200", status: "Failed", created: "04:10 PM" },
  ];

  const columns = [
    { header: "Transaction", accessor: "id" as const },
    { header: "Order", accessor: "order" as const },
    { header: "Customer", accessor: "customer" as const },
    { 
      header: "Gateway", 
      accessor: (row: any) => <PaymentGatewayBadge gateway={row.gateway} status={row.status.toLowerCase()} /> 
    },
    { header: "Method", accessor: "method" as const },
    { header: "Amount", accessor: "amount" as const },
    { header: "Created", accessor: "created" as const },
  ];

  const tabs = ["All", "Koko", "Mintpay", "OnePay", "Payzy", "COD"];

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-8">
      
      <PageHeader 
        title="Payments" 
        description="Financial transaction management and gateway health."
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Collected" value="Rs.2.4M" trend="↑ 12%" trendType="positive" />
        <StatCard label="Successful" value="1,245" trend="94.8% Rate" trendType="positive" />
        <StatCard label="Pending" value="42" />
        <StatCard label="Failed" value="18" trend="↓ 2%" trendType="positive" />
      </div>

      {/* Gateway Tabs */}
      <div className="flex border-b border-stone-200">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-inter text-sm font-medium transition-colors ${
              activeTab === tab 
                ? "border-b-2 border-primary text-primary" 
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <DataTable 
        data={transactions}
        columns={columns}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => router.push(`/admin/payments/${row.id}`)}
        pagination={{ currentPage: 1, totalPages: 5 }}
      />
    </div>
  );
}
