"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import { useInventoryValuationReport } from "@/hooks/useReports";
import { Download, AlertTriangle } from "lucide-react";

export default function InventoryReportPage() {
  const { data, isLoading, error } = useInventoryValuationReport();

  const handleDownloadCSV = () => {
    if (!data) return;
    const csvRows = ["Branch Name,Total Stock Items,Retail Valuation (Rs)"];
    data.branchValuations.forEach(row => {
      csvRows.push(`${row.branchName},${row.totalItems},${row.valuation}`);
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory_valuation_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className="p-10 font-poppins">Loading report...</div>;
  if (error || !data) return <div className="p-10 font-poppins text-red-500">Failed to load report.</div>;

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <PageHeader 
          title="Inventory Valuation Report" 
          description="Total retail value of stock across all physical and virtual warehouses."
        />
        <button onClick={handleDownloadCSV} className="h-10 px-4 bg-primary text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-stone-800 transition-colors">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Global Valuation Card */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-sm font-medium text-stone-500 font-inter uppercase tracking-wider">Total Global Retail Valuation</h3>
          <p className="text-4xl font-semibold text-primary font-poppins mt-2">Rs. {data.totalGlobalValuation.toLocaleString()}</p>
        </div>
        <div className="w-full md:w-px md:h-16 bg-stone-200"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-primary font-poppins">{data.lowStockItems.length}</p>
            <p className="text-sm font-medium text-stone-500 font-inter">Low Stock SKUs Global</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Valuations Table */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary font-poppins mb-6">Valuation by Branch</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="py-3 font-medium text-stone-500 font-inter text-sm">Branch</th>
                  <th className="py-3 font-medium text-stone-500 font-inter text-sm text-right">Total Items</th>
                  <th className="py-3 font-medium text-stone-500 font-inter text-sm text-right">Retail Valuation</th>
                </tr>
              </thead>
              <tbody>
                {data.branchValuations.map((row, idx) => (
                  <tr key={idx} className="border-b border-stone-100 last:border-0">
                    <td className="py-4 font-medium text-stone-900 font-poppins text-sm">{row.branchName}</td>
                    <td className="py-4 text-stone-600 font-inter text-sm text-right">{row.totalItems.toLocaleString()}</td>
                    <td className="py-4 text-stone-900 font-poppins font-semibold text-sm text-right">Rs. {row.valuation.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col h-[500px]">
          <h3 className="text-lg font-semibold text-primary font-poppins mb-6 flex items-center gap-2">
            Low Stock Alerts <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">{data.lowStockItems.length}</span>
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {data.lowStockItems.length === 0 ? (
              <div className="text-center text-stone-500 text-sm py-10">No low stock items!</div>
            ) : (
              data.lowStockItems.map((item, idx) => (
                <div key={idx} className="p-4 border border-red-100 bg-red-50/50 rounded-lg">
                  <p className="font-poppins font-medium text-stone-900 text-sm mb-1">{item.productName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-inter text-stone-500">{item.branchName}</span>
                    <span className="text-xs font-inter font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                      {item.quantity} left (Threshold: {item.threshold})
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
