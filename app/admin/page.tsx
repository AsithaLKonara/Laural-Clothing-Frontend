"use client";

import { useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RevenueOverviewTable from "@/components/dashboard/RevenueOverviewTable";
import RecentTransactionsTable from "@/components/dashboard/RecentTransactionsTable";
import { TrendingUp, ShoppingCart, Users, Receipt, Package, Wallet, Gift, RefreshCcw } from "lucide-react";
import { useBusinessOverview } from "@/hooks/useAnalytics";

const BRANCHES = ["All", "Online", "Colombo", "Kandy", "Gampaha"];

const GATEWAY_COLORS: Record<string, string> = {
  "KOKO": "bg-violet-500",
  "MINTPAY": "bg-purple-400",
  "ONEPAY": "bg-blue-500",
  "PAYZY": "bg-sky-400",
  "COD": "bg-stone-400",
  "CASH": "bg-emerald-500",
  "CARD": "bg-teal-500"
};

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `Rs. ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `Rs. ${(value / 1000).toFixed(1)}K`;
  return `Rs. ${value.toFixed(0)}`;
};

export default function SuperAdminDashboard() {
  const [activeBranch, setActiveBranch] = useState("All");
  const [activePeriod, setActivePeriod] = useState("Today");

  const { data: analytics, isLoading } = useBusinessOverview(activePeriod, activeBranch);

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
          <button className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 px-4 py-2.5 rounded-xl font-inter text-sm font-medium transition-colors shadow-sm">
            Export
          </button>
        </div>
      </div>

      {/* Branch Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {BRANCHES.map(branch => (
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

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-stone-100 rounded-2xl animate-pulse"></div>)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-stone-100 rounded-2xl animate-pulse"></div>)}
          </div>
        </div>
      ) : analytics ? (
        <>
          {/* Stat Cards Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Revenue" value={formatCurrency(analytics.revenue.value)} trend={analytics.revenue.trend} trendType={analytics.revenue.trendType} icon={<TrendingUp size={16} />} />
            <StatCard label="Orders" value={analytics.orders.value.toString()} trend={analytics.orders.trend} trendType={analytics.orders.trendType} icon={<ShoppingCart size={16} />} />
            <StatCard label="New Customers" value={analytics.newCustomers.value.toString()} trend={analytics.newCustomers.trend} trendType={analytics.newCustomers.trendType} icon={<Users size={16} />} />
            <StatCard label="Avg Order Value" value={formatCurrency(analytics.avgOrderValue.value)} trend={analytics.avgOrderValue.trend} trendType={analytics.avgOrderValue.trendType} icon={<Receipt size={16} />} />
          </div>

          {/* Stat Cards Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Pending Orders" value={analytics.pendingOrders.value.toString()} trend={analytics.pendingOrders.trend} trendType={analytics.pendingOrders.trendType} icon={<Package size={16} />} />
            <StatCard label="Inventory Value" value={formatCurrency(analytics.inventoryValue.value)} trend={analytics.inventoryValue.trend} trendType={analytics.inventoryValue.trendType} icon={<Wallet size={16} />} />
            <StatCard label="Loyalty Points" value={analytics.loyaltyPoints.value.toString()} trend={analytics.loyaltyPoints.trend} trendType={analytics.loyaltyPoints.trendType} icon={<Gift size={16} />} />
            <StatCard label="Returns" value={formatCurrency(analytics.returns.value)} trend={analytics.returns.trend} trendType={analytics.returns.trendType} icon={<RefreshCcw size={16} />} />
          </div>

          {/* Payment Gateway Performance */}
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden w-full">
            <div className="px-4 md:px-6 py-4 md:py-5 border-b border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <h2 className="font-inter font-bold text-stone-900 text-base">Payment Gateway Performance</h2>
                <p className="font-inter text-xs text-stone-400 mt-0.5">Breakdown by gateway for the selected period</p>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-3 overflow-x-auto">
              <div className="min-w-[500px]">
                {analytics.paymentGatewayPerformance?.length > 0 ? (
                  analytics.paymentGatewayPerformance.map((g: any) => (
                    <div key={g.gw} className="flex items-center gap-4 py-1">
                      <div className="w-20 font-inter font-bold text-sm text-stone-800 shrink-0">{g.gw}</div>
                      <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                        <div className={`h-2 rounded-full ${GATEWAY_COLORS[g.gw] || "bg-stone-500"}`} style={{ width: `${g.pct}%` }} />
                      </div>
                      <div className="w-8 text-xs font-bold text-stone-500 text-right shrink-0">{g.pct}%</div>
                      <div className="w-28 font-inter font-bold text-sm text-stone-900 text-right shrink-0">{formatCurrency(g.amount)}</div>
                      <div className="w-20 font-inter text-xs text-stone-400 text-right shrink-0">{g.count} txns</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-stone-500 font-inter text-sm">No payment data for this period.</div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-stone-500">Failed to load analytics data.</div>
      )}

      {/* Charts & Breakdown Row */}
      <div className="flex flex-col lg:flex-row gap-5 mt-2">
        <div className="flex-1 bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden w-full overflow-x-auto">
          <RevenueChart />
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden w-full lg:w-[350px] shrink-0 overflow-x-auto">
          <RevenueOverviewTable />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        <RecentTransactionsTable />
      </div>

      <div className="h-6" />
    </div>
  );
}
