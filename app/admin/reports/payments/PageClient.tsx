"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import { usePaymentReport } from "@/hooks/useReports";
import { Download } from "lucide-react";
import dynamic from "next/dynamic";

const PaymentsChart = dynamic(() => import("./PaymentsChart"), { 
  ssr: false, 
  loading: () => <div className="h-[300px] w-full flex items-center justify-center bg-stone-50 rounded-lg animate-pulse text-stone-400">Loading chart...</div> 
});

export default function PaymentReportPage() {
  const { data, isLoading, error } = usePaymentReport();

  const handleDownloadCSV = () => {
    if (!data) return;
    const csvRows = ["Payment Gateway,Total Revenue,Transaction Count"];
    data.forEach(row => {
      csvRows.push(`${row.method},${row.revenue},${row.count}`);
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payment_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className="p-10 font-poppins">Loading report...</div>;
  if (error || !data) return <div className="p-10 font-poppins text-red-500">Failed to load report.</div>;

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <PageHeader 
          title="Payment Gateway Report" 
          description="Distribution of revenue and transaction volume across payment methods."
        />
        <button onClick={handleDownloadCSV} className="h-10 px-4 bg-primary text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-stone-800 transition-colors">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary font-poppins mb-6">Revenue Distribution</h3>
          <PaymentsChart data={data} />
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary font-poppins mb-6">Gateway Statistics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="py-3 font-medium text-stone-500 font-inter text-sm">Gateway</th>
                  <th className="py-3 font-medium text-stone-500 font-inter text-sm text-right">Transactions</th>
                  <th className="py-3 font-medium text-stone-500 font-inter text-sm text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-b border-stone-100 last:border-0">
                    <td className="py-4 font-medium text-stone-900 font-poppins text-sm">{row.method}</td>
                    <td className="py-4 text-stone-600 font-inter text-sm text-right">{row.count}</td>
                    <td className="py-4 text-stone-900 font-poppins font-semibold text-sm text-right">Rs. {row.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
