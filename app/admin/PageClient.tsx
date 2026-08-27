"use client";

import { useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RevenueOverviewTable from "@/components/dashboard/RevenueOverviewTable";
import RecentTransactionsTable from "@/components/dashboard/RecentTransactionsTable";
import { TrendingUp, ShoppingCart, Users, Receipt, Package, Wallet, Gift, RefreshCcw } from "lucide-react";
import { useBranches } from "@/hooks/useInventory";
import { globalDialog } from "@/store/dialog.store";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useQueryClient } from "@tanstack/react-query";
import ErrorBoundary from "@/components/ErrorBoundary";

const DashboardData = dynamic(() => import("@/components/dashboard/DashboardData"), { ssr: false });

const GATEWAY_COLORS: Record<string, string> = {
  "KOKO": "bg-violet-500",
  "MINTPAY": "bg-purple-400",
  "ONEPAY": "bg-blue-500",
  "PAYZY": "bg-sky-400",
  "COD": "bg-stone-400",
  "CASH": "bg-emerald-500",
  "CARD": "bg-teal-500"
};

const DashboardSkeleton = () => (
  <div className="flex flex-col gap-4 mt-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-stone-100 rounded-2xl animate-pulse"></div>)}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-stone-100 rounded-2xl animate-pulse"></div>)}
    </div>
  </div>
);

export default function SuperAdminDashboard() {
  const [activeBranch, setActiveBranch] = useState("All");
  const [activePeriod, setActivePeriod] = useState("Today");

  const { data: branchesData, error: branchesError } = useBranches();
  
  // Combine static options with dynamic branches from DB
  const dynamicBranches = branchesData ? (Array.isArray(branchesData) ? branchesData.map((b: any) => b.name) : []) : [];
  const displayBranches = ["All", "Online", ...dynamicBranches];
  const queryClient = useQueryClient();

  const handleExport = () => {
    const analytics: any = queryClient.getQueryData(['analytics', 'overview', activePeriod, activeBranch]);
    if (!analytics || !analytics.recentTransactions || analytics.recentTransactions.length === 0) {
      globalDialog.alert("No data available to export");
      return;
    }

    const headers = ["Order ID", "Customer", "Branch", "Amount", "Payment Method", "Payment Status", "Order Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...analytics.recentTransactions.map((tx: any) => [
        tx.id,
        `"${tx.customer}"`,
        `"${tx.branch}"`,
        tx.amount,
        tx.paymentMethod,
        tx.paymentStatus,
        tx.orderStatus,
        new Date(tx.createdAt).toLocaleString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dashboard_export_${activePeriod.replace(/ /g, "_").toLowerCase()}_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-10 max-w-[1280px] mx-auto w-full overflow-hidden md:overflow-visible">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-inter font-bold text-[26px] leading-[32px] text-stone-900 tracking-tight">
            Business Overview
          </h1>
          <p className="font-inter text-[13px] text-stone-500 leading-relaxed">
            Global performance across all branches, channels, and payment gateways
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto mt-2 md:mt-0">
          <select 
            value={activePeriod}
            onChange={(e) => setActivePeriod(e.target.value)}
            className="flex-1 md:flex-none bg-white border border-stone-200 rounded-xl py-2.5 px-4 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400 shadow-sm"
          >
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 px-4 py-2.5 rounded-xl font-inter text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export
          </button>
        </div>
      </div>

      {/* Branch Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {displayBranches.map((branch: string) => (
          <button
            key={branch}
            onClick={() => setActiveBranch(branch)}
            className={`px-4 py-2 rounded-xl text-sm font-inter font-medium transition-all ${
              activeBranch === branch
                ? "bg-stone-900 text-white shadow-md shadow-stone-900/20"
                : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300"
            }`}
          >
            {branch}
          </button>
        ))}
      </div>

      <ErrorBoundary>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardData activePeriod={activePeriod} activeBranch={activeBranch} />
        </Suspense>
      </ErrorBoundary>

      <div className="h-6" />
    </div>
  );
}
