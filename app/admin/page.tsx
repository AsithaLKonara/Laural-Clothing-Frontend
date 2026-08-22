"use client";

import { useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RevenueOverviewTable from "@/components/dashboard/RevenueOverviewTable";
import RecentTransactionsTable from "@/components/dashboard/RecentTransactionsTable";
import { TrendingUp, ShoppingCart, Users, Receipt, Package, Wallet, Gift, RefreshCcw } from "lucide-react";

const BRANCHES = ["All", "Online", "Colombo", "Kandy", "Gampaha"];
const GATEWAYS = ["Koko", "Mintpay", "OnePay", "Payzy", "COD"];

export default function SuperAdminDashboard() {
  const [activeBranch, setActiveBranch] = useState("All");

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
          <select className="flex-1 md:flex-none bg-white border border-stone-200 rounded-xl py-2.5 px-4 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400 shadow-sm">
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
            className={`px-4 py-2 rounded-xl text-sm font-inter font-medium transition-all ${activeBranch === branch
                ? "bg-stone-900 text-white shadow-md shadow-stone-900/20"
                : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300"
              }`}
          >
            {branch}
          </button>
        ))}
      </div>

      {/* Stat Cards Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue" value="Rs. 845K" trend="↑ 12.4% vs last period" trendType="positive" icon={<TrendingUp size={16} />} />
        <StatCard label="Orders" value="186" trend="↑ 8.2% vs last period" trendType="positive" icon={<ShoppingCart size={16} />} />
        <StatCard label="New Customers" value="92" trend="↑ 16% this period" trendType="positive" icon={<Users size={16} />} />
        <StatCard label="Avg Order Value" value="Rs. 4,543" trend="↑ 4.2%" trendType="positive" icon={<Receipt size={16} />} />
      </div>

      {/* Stat Cards Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Orders" value="24" trend="Requires action" trendType="neutral" icon={<Package size={16} />} />
        <StatCard label="Inventory Value" value="Rs. 2.4M" trend="Across all branches" trendType="neutral" icon={<Wallet size={16} />} />
        <StatCard label="Loyalty Points" value="84,520" trend="Outstanding balance" trendType="neutral" icon={<Gift size={16} />} />
        <StatCard label="Returns" value="Rs. 42K" trend="This month" trendType="negative" icon={<RefreshCcw size={16} />} />
      </div>

      {/* Payment Gateway Performance */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden w-full">
        <div className="px-4 md:px-6 py-4 md:py-5 border-b border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h2 className="font-inter font-bold text-stone-900 text-base">Payment Gateway Performance</h2>
            <p className="font-inter text-xs text-stone-400 mt-0.5">Breakdown by gateway for the selected period</p>
          </div>
          <select className="w-full sm:w-auto bg-white border border-stone-200 rounded-lg py-1.5 px-3 text-xs font-inter text-stone-600 outline-none focus:ring-1 focus:ring-stone-300">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
          </select>
        </div>
        <div className="p-6 flex flex-col gap-3 overflow-x-auto">
          <div className="min-w-[500px]">
            {[
              { gw: "Koko", amount: "Rs. 245,000", pct: 29, count: 42, color: "bg-violet-500" },
              { gw: "Mintpay", amount: "Rs. 184,000", pct: 22, count: 31, color: "bg-purple-400" },
              { gw: "OnePay", amount: "Rs. 152,000", pct: 18, count: 28, color: "bg-blue-500" },
              { gw: "Payzy", amount: "Rs. 126,000", pct: 15, count: 21, color: "bg-sky-400" },
              { gw: "COD", amount: "Rs. 132,000", pct: 16, count: 30, color: "bg-stone-400" },
            ].map(g => (
              <div key={g.gw} className="flex items-center gap-4">
                <div className="w-20 font-inter font-bold text-sm text-stone-800 shrink-0">{g.gw}</div>
                <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-2 rounded-full ${g.color}`} style={{ width: `${g.pct}%` }} />
                </div>
                <div className="w-8 text-xs font-bold text-stone-500 text-right shrink-0">{g.pct}%</div>
                <div className="w-28 font-inter font-bold text-sm text-stone-900 text-right shrink-0">{g.amount}</div>
                <div className="w-20 font-inter text-xs text-stone-400 text-right shrink-0">{g.count} txns</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts & Breakdown Row */}
      <div className="flex flex-col lg:flex-row gap-5">
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
