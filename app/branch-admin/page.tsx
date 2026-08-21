"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { OrderStatusBadge, PaymentGatewayBadge } from "@/components/dashboard/Badges";

export default function BranchAdminPage() {

  const activeCashiers = [
    { name: "Kasun Perera", status: "Active", shift: "09:00 AM", sales: "Rs. 42,500" },
    { name: "Nimal Fernando", status: "Offline", shift: "Yesterday", sales: "Rs. 31,200" },
  ];

  const recentOrders = [
    { id: "LC-10241", customer: "Kasun", channel: "Online", amount: "Rs. 8,500", gateway: "Koko", status: "Paid", orderStatus: "Paid" },
    { id: "POS-10492", customer: "Walk-in", channel: "POS", amount: "Rs. 4,200", gateway: "Cash", status: "Paid", orderStatus: "Completed" },
    { id: "LC-10239", customer: "Guest", channel: "Online", amount: "Rs. 3,900", gateway: "COD", status: "Pending", orderStatus: "Pending" },
  ];

  const orderColumns = [
    { header: "Order", accessor: "id" as const },
    { header: "Customer", accessor: "customer" as const },
    { 
      header: "Channel", 
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${row.channel === 'POS' ? 'bg-stone-200 text-stone-800' : 'bg-blue-100 text-blue-800'}`}>
          {row.channel}
        </span>
      )
    },
    { header: "Amount", accessor: "amount" as const },
    { 
      header: "Payment", 
      accessor: (row: any) => <PaymentGatewayBadge gateway={row.gateway} status={row.status.toLowerCase()} /> 
    },
    { 
      header: "Status", 
      accessor: (row: any) => <OrderStatusBadge status={row.orderStatus} /> 
    },
  ];

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-8">
      
      <PageHeader 
        title="Kandy Branch Overview" 
        description="What is happening in your store today?"
        action={
          <select className="bg-white border border-stone-200 rounded-lg py-2 px-4 text-sm font-inter text-stone-900 outline-none focus:ring-1 focus:ring-stone-400">
            <option>Today</option>
            <option>Yesterday</option>
            <option>This Week</option>
          </select>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value="Rs. 207,000" trend="POS: 125K | Online: 82K" trendType="neutral" />
        <StatCard label="Orders" value="42" trend="POS: 28 | Online: 14" trendType="neutral" />
        <StatCard label="Pending Online Orders" value="6" trend="Action required" trendType="negative" />
        <StatCard label="Low Stock Products" value="16" trend="Needs transfer" trendType="negative" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Orders */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 font-inter">Recent Orders</h3>
              <button className="text-xs text-blue-600 font-medium hover:underline">View All</button>
            </div>
            <DataTable 
              data={recentOrders}
              columns={orderColumns}
              keyExtractor={(row) => row.id}
            />
          </div>
        </div>

        {/* Right Col: Cashiers & Payments */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h3 className="font-bold text-stone-900 font-inter">Payment Performance</h3>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {[
                { gw: "Koko", val: "Rs. 42,000" },
                { gw: "Mintpay", val: "Rs. 31,500" },
                { gw: "OnePay", val: "Rs. 22,000" },
                { gw: "Payzy", val: "Rs. 18,500" },
                { gw: "COD", val: "Rs. 21,000" },
                { gw: "POS Cash", val: "Rs. 72,000" },
              ].map(p => (
                <div key={p.gw} className="flex items-center justify-between">
                  <span className="font-inter text-sm text-stone-600">{p.gw}</span>
                  <span className="font-inter text-sm font-bold text-stone-900">{p.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 font-inter">Cashiers</h3>
            </div>
            <div className="flex flex-col">
              {activeCashiers.map(c => (
                <div key={c.name} className="flex flex-col p-4 border-b border-stone-100 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${c.status === 'Active' ? 'bg-emerald-500' : 'bg-stone-300'}`}></div>
                      <span className="font-inter font-bold text-sm text-stone-900">{c.name}</span>
                    </div>
                    <button className="text-xs text-blue-600 font-medium hover:underline">View</button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-stone-500 pl-4">
                    <span>Shift: {c.shift}</span>
                    <span className="font-bold text-stone-700">Sales: {c.sales}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
