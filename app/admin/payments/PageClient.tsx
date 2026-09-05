"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import StatCard from "@/components/dashboard/StatCard";
import { PaymentGatewayBadge } from "@/components/dashboard/Badges";
import { useState } from "react";
import { usePaymentTransactions, usePaymentKpis } from "@/hooks/usePayments";

export default function PaymentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);

  const { data: txResponse, isLoading: txLoading } = usePaymentTransactions({
    gateway: activeTab,
    page,
    limit: 10
  });

  const { data: kpiResponse, isLoading: kpiLoading } = usePaymentKpis(activeTab);

  const transactions = txResponse?.data || [];
  const meta = txResponse?.meta || { currentPage: 1, totalPages: 1 };
  
  const kpis = kpiResponse?.data || {
    totalAmount: 0,
    successfulCount: "0",
    pendingCount: "0",
    failedCount: "0",
    successRate: 0
  };

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
        <StatCard label="Total Collected" value={`Rs. ${kpis.totalAmount.toLocaleString()}`} trend={activeTab === "All" ? "All time" : undefined} trendType="positive" />
        <StatCard label="Successful" value={kpis.successfulCount} trend={`${kpis.successRate}% Rate`} trendType={kpis.successRate >= 90 ? "positive" : "neutral"} />
        <StatCard label="Pending" value={kpis.pendingCount} />
        <StatCard label="Failed" value={kpis.failedCount} trend={activeTab === "All" ? "All time" : undefined} trendType="positive" />
      </div>

      {/* Gateway Tabs */}
      <div className="flex border-b border-stone-200">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }}
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
        pagination={{ 
          currentPage: meta.page, 
          totalPages: meta.totalPages || 1,
          onPageChange: (newPage) => setPage(newPage)
        }}
      />
    </div>
  );
}
