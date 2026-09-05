"use client";

import { useState } from "react";
import { Search, Loader2, Store, Calendar, FileText, Download } from "lucide-react";
import { useBranches } from "@/hooks/useInventory";
import { useOrders } from "@/hooks/useOrders";
import { useBranchReport } from "@/hooks/useReports";
import { format } from "date-fns";
import Link from "next/link";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR'
  }).format(price);
};

export default function POSSalesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: branchesData, isLoading: isLoadingBranches } = useBranches();
  
  const branches = branchesData?.data || [];
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);

  // Set default active branch when branches load
  if (!activeBranchId && branches.length > 0) {
    setActiveBranchId(branches[0].id);
  }

  const { data: ordersData, isLoading: isLoadingOrders } = useOrders({ 
    branchId: activeBranchId || undefined,
    search: searchTerm || undefined,
    type: "POS",
  });

  const orders = ordersData?.data || [];
  const meta = ordersData?.meta;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  const { data: branchReportData, isLoading: isLoadingReport } = useBranchReport();
  const currentBranchMetrics = branchReportData?.find((b: any) => b.branchId === activeBranchId);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-6 border-b border-border bg-surface shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-inter flex items-center gap-2">
              <Store className="text-primary" />
              POS Sales Dashboard
            </h1>
            <p className="text-muted mt-1 font-inter text-sm">
              View and manage point-of-sale transactions across all branches
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-background hover:bg-surface transition-colors text-sm font-semibold text-foreground">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Branch Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {isLoadingBranches ? (
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-24 bg-stone-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <>
              {branches.map((branch: any) => (
                <button
                  key={branch.id}
                  onClick={() => setActiveBranchId(branch.id)}
                  className={`px-5 py-2.5 rounded-lg font-inter font-semibold text-sm whitespace-nowrap transition-colors border ${
                    activeBranchId === branch.id
                      ? "bg-primary-soft text-primary border-primary shadow-sm"
                      : "bg-background text-muted border-border hover:bg-surface"
                  }`}
                >
                  {branch.name}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        
        {/* Metrics Cards */}
        {activeBranchId && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
              <p className="text-muted text-sm font-semibold font-inter mb-1">Total Revenue</p>
              {isLoadingReport ? (
                <div className="h-8 w-24 bg-stone-100 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-foreground font-inter">
                  {formatPrice(currentBranchMetrics?.revenue || 0)}
                </p>
              )}
            </div>
            <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
              <p className="text-muted text-sm font-semibold font-inter mb-1">Total Orders</p>
              {isLoadingReport ? (
                <div className="h-8 w-16 bg-stone-100 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-foreground font-inter">
                  {currentBranchMetrics?.orders || 0}
                </p>
              )}
            </div>
            <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
              <p className="text-muted text-sm font-semibold font-inter mb-1">Active Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-foreground">Online</span>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer..."
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-inter"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-border">
                  <th className="px-6 py-4 font-inter text-xs font-semibold text-muted uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 font-inter text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 font-inter text-xs font-semibold text-muted uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 font-inter text-xs font-semibold text-muted uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 font-inter text-xs font-semibold text-muted uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 font-inter text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-inter text-xs font-semibold text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoadingOrders ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-muted">
                        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                        <p className="font-inter">Loading sales data...</p>
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-muted">
                        <FileText className="h-12 w-12 mb-4 opacity-20" />
                        <p className="font-inter text-lg font-medium">No sales found</p>
                        <p className="font-inter text-sm opacity-70">
                          {searchTerm ? "Try a different search term" : "No POS sales have been recorded for this branch yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-foreground">{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted font-inter">
                          <Calendar size={14} />
                          {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-inter text-sm">
                          <p className="font-semibold text-foreground">{order.customer?.name || order.customer?.firstName || 'Walk-in Customer'}</p>
                          {(order.customer?.email || order.customer?.phone) && (
                            <p className="text-xs text-muted">{order.customer?.email || order.customer?.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-inter text-sm text-foreground">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4 font-inter text-sm font-semibold text-foreground">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold font-inter border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="text-primary hover:text-primary-hover font-inter text-sm font-semibold hover:underline"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Placeholder */}
          {meta && meta.totalPages > 1 && (
            <div className="p-4 border-t border-border bg-stone-50 flex items-center justify-between">
              <p className="text-sm text-muted font-inter">
                Showing <span className="font-semibold text-foreground">{orders.length}</span> of <span className="font-semibold text-foreground">{meta.total}</span> results
              </p>
              {/* Pagination controls would go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
