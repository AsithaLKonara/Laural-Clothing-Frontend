"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { useSalesReport } from "@/hooks/useReports";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download } from "lucide-react";

export default function SalesReportPage() {
  const [dateRange, setDateRange] = useState("30"); // 30 days
  const { data, isLoading, error } = useSalesReport();

  const handleDownloadCSV = () => {
    if (!data) return;
    const csvRows = [];
    csvRows.push("Date,Total Revenue,Total Orders,Ecommerce Revenue,POS Revenue");
    
    data.dailyTrend.forEach(row => {
      csvRows.push(`${row.date},${row.revenue},${row.orders},${row.ecommerceRevenue},${row.posRevenue}`);
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className="p-10 font-poppins">Loading report...</div>;
  if (error || !data) return <div className="p-10 font-poppins text-red-500">Failed to load report.</div>;

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <PageHeader 
          title="Sales & Revenue Report" 
          description="Detailed breakdown of sales performance over time."
        />
        <div className="flex items-center gap-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="h-10 px-4 border border-stone-200 rounded-lg bg-white text-sm font-inter text-stone-700 outline-none focus:border-primary"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <button onClick={handleDownloadCSV} className="h-10 px-4 bg-primary text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-stone-800 transition-colors">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-stone-500 font-inter">Total Revenue</h3>
          <p className="text-3xl font-semibold text-primary font-poppins mt-2">Rs. {data.summary.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-stone-500 font-inter">Total Orders</h3>
          <p className="text-3xl font-semibold text-primary font-poppins mt-2">{data.summary.totalOrders.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-stone-500 font-inter">Average Order Value (AOV)</h3>
          <p className="text-3xl font-semibold text-primary font-poppins mt-2">Rs. {data.summary.aov.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary font-poppins mb-6">Revenue Trend</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailyTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
              <XAxis dataKey="date" stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rs.${val/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e7e5e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`Rs. ${Number(value).toLocaleString()}`, undefined]}
              />
              <Legend iconType="circle" />
              <Line type="monotone" name="Ecommerce" dataKey="ecommerceRevenue" stroke="#1c1917" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
              <Line type="monotone" name="POS" dataKey="posRevenue" stroke="#a8a29e" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
