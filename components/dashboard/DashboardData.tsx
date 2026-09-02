"use client";

import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RevenueOverviewTable from "@/components/dashboard/RevenueOverviewTable";
import RecentTransactionsTable from "@/components/dashboard/RecentTransactionsTable";
import { TrendingUp, ShoppingCart, Users, Receipt, Package, Wallet, Gift, RefreshCcw } from "lucide-react";
import { useBusinessOverviewSuspense } from "@/hooks/useAnalytics";
import { useAuthStore } from "@/store/auth.store";

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

interface DashboardDataProps {
  activePeriod: string;
  activeBranch: string;
}

export default function DashboardData({ activePeriod, activeBranch }: DashboardDataProps) {
  const { data: analytics } = useBusinessOverviewSuspense(activePeriod, activeBranch);
  const { hasPermission } = useAuthStore();

  const canViewFinancials = hasPermission("reports:view_financial") || hasPermission("reports:view_dashboard") || hasPermission("payments:view_transactions");
  const canViewOrders = hasPermission("orders:view");
  const canViewCustomers = hasPermission("customers:view");
  const canViewInventory = hasPermission("inventory:view_stock");
  const canViewLoyalty = hasPermission("loyalty:view_points");
  const canViewReturns = hasPermission("returns:view");
  const canViewPayments = hasPermission("payments:view_transactions") || canViewFinancials;

  const statCardsRow1 = [];
  if (canViewFinancials) {
    statCardsRow1.push(<StatCard key="revenue" label="Revenue" value={formatCurrency(analytics.revenue.value)} trend={analytics.revenue.trend} trendType={analytics.revenue.trendType} icon={<TrendingUp size={16} />} />);
  }
  if (canViewOrders) {
    statCardsRow1.push(<StatCard key="orders" label="Orders" value={analytics.orders.value.toString()} trend={analytics.orders.trend} trendType={analytics.orders.trendType} icon={<ShoppingCart size={16} />} />);
  }
  if (canViewCustomers) {
    statCardsRow1.push(<StatCard key="customers" label="New Customers" value={analytics.newCustomers.value.toString()} trend={analytics.newCustomers.trend} trendType={analytics.newCustomers.trendType} icon={<Users size={16} />} />);
  }
  if (canViewFinancials) {
    statCardsRow1.push(<StatCard key="aov" label="Avg Order Value" value={formatCurrency(analytics.avgOrderValue.value)} trend={analytics.avgOrderValue.trend} trendType={analytics.avgOrderValue.trendType} icon={<Receipt size={16} />} />);
  }

  const statCardsRow2 = [];
  if (canViewOrders) {
    statCardsRow2.push(<StatCard key="pending" label="Pending Orders" value={analytics.pendingOrders.value.toString()} trend={analytics.pendingOrders.trend} trendType={analytics.pendingOrders.trendType} icon={<Package size={16} />} />);
  }
  if (canViewInventory) {
    statCardsRow2.push(<StatCard key="inventory" label="Inventory Value" value={formatCurrency(analytics.inventoryValue.value)} trend={analytics.inventoryValue.trend} trendType={analytics.inventoryValue.trendType} icon={<Wallet size={16} />} />);
  }
  if (canViewLoyalty) {
    statCardsRow2.push(<StatCard key="loyalty" label="Loyalty Points" value={analytics.loyaltyPoints.value.toString()} trend={analytics.loyaltyPoints.trend} trendType={analytics.loyaltyPoints.trendType} icon={<Gift size={16} />} />);
  }
  if (canViewReturns) {
    statCardsRow2.push(<StatCard key="returns" label="Returns" value={formatCurrency(analytics.returns.value)} trend={analytics.returns.trend} trendType={analytics.returns.trendType} icon={<RefreshCcw size={16} />} />);
  }

  return (
    <>
      {/* Stat Cards Row 1 */}
      {statCardsRow1.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {statCardsRow1}
        </div>
      )}

      {/* Stat Cards Row 2 */}
      {statCardsRow2.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCardsRow2}
        </div>
      )}

      {/* Payment Gateway Performance */}
      {canViewPayments && (
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
      )}

      {/* Charts & Breakdown Row */}
      {canViewFinancials && (
        <div className="flex flex-col lg:flex-row gap-5 mt-2">
          <div className="flex-1 bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden w-full overflow-x-auto">
            <RevenueChart data={analytics?.paymentGatewayPerformance} />
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden w-full lg:w-[350px] shrink-0 overflow-x-auto">
            <RevenueOverviewTable data={analytics?.paymentGatewayPerformance} />
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {(canViewOrders || canViewPayments) && (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden mt-5">
          <RecentTransactionsTable transactions={analytics?.recentTransactions} />
        </div>
      )}
    </>
  );
}
