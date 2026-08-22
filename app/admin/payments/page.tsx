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

  const allTransactions = [
    { id: "TXN-82931", order: "LC-10241", customer: "Kasun", gateway: "Koko", method: "Installment", amount: 8500, amountStr: "Rs. 8,500", status: "Paid", created: "12:42 PM" },
    { id: "TXN-82932", order: "LC-10240", customer: "Nethmi", gateway: "Mintpay", method: "Installment", amount: 5200, amountStr: "Rs. 5,200", status: "Paid", created: "01:15 PM" },
    { id: "TXN-82933", order: "LC-10239", customer: "Guest", gateway: "COD", method: "Cash", amount: 3900, amountStr: "Rs. 3,900", status: "Pending", created: "02:20 PM" },
    { id: "TXN-82934", order: "LC-10238", customer: "Dilshan", gateway: "OnePay", method: "Card", amount: 7800, amountStr: "Rs. 7,800", status: "Paid", created: "03:45 PM" },
    { id: "TXN-82935", order: "LC-10237", customer: "Anu", gateway: "Payzy", method: "Card", amount: 9200, amountStr: "Rs. 9,200", status: "Failed", created: "04:10 PM" },
  ];

  const transactions = activeTab === "All" ? allTransactions : allTransactions.filter(t => t.gateway === activeTab);

  // Dynamic KPIs
  const totalAmount = transactions.filter(t => t.status === "Paid").reduce((acc, t) => acc + t.amount, 0);
  const successfulCount = transactions.filter(t => t.status === "Paid").length;
  const pendingCount = transactions.filter(t => t.status === "Pending").length;
  const failedCount = transactions.filter(t => t.status === "Failed").length;
  const totalCount = transactions.length;
  const successRate = totalCount > 0 ? Math.round((successfulCount / totalCount) * 100) : 0;


  const columns = [
    { header: "Transaction", accessor: "id" as const },
    { header: "Order", accessor: "order" as const },
    { header: "Customer", accessor: "customer" as const },
    { 
      header: "Gateway", 
      accessor: (row: any) => <PaymentGatewayBadge gateway={row.gateway} status={row.status.toLowerCase()} /> 
    },
    { header: "Method", accessor: "method" as const },
    { header: "Amount", accessor: "amountStr" as const },
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
        <StatCard label="Total Collected" value={`Rs. ${totalAmount.toLocaleString()}`} trend={activeTab === "All" ? "↑ 12%" : undefined} trendType="positive" />
        <StatCard label="Successful" value={successfulCount.toString()} trend={`${successRate}% Rate`} trendType={successRate >= 90 ? "positive" : "neutral"} />
        <StatCard label="Pending" value={pendingCount.toString()} />
        <StatCard label="Failed" value={failedCount.toString()} trend={activeTab === "All" ? "↓ 2%" : undefined} trendType="positive" />
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
