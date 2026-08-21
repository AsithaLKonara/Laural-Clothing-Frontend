"use client";

import { Package, Truck, CheckCircle2, AlertCircle, Eye, RotateCcw } from "lucide-react";
import Link from "next/link";

const DUMMY_RETURNS = [
  {
    id: "RET-992384",
    orderId: "ORD-12345",
    date: "2026-08-12",
    status: "APPROVED", // REQUESTED, APPROVED, SHIPPED, RECEIVED, REFUNDED, REJECTED
    items: 1,
    refundAmount: "LKR 12,500"
  },
  {
    id: "RET-884712",
    orderId: "ORD-12001",
    date: "2026-07-28",
    status: "REFUNDED",
    items: 2,
    refundAmount: "LKR 28,000"
  }
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "REQUESTED":
      return { icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-100", label: "Requested" };
    case "APPROVED":
      return { icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-100", label: "Approved (Awaiting Return)" };
    case "SHIPPED":
      return { icon: Truck, color: "text-purple-500", bg: "bg-purple-100", label: "In Transit" };
    case "RECEIVED":
      return { icon: Package, color: "text-indigo-500", bg: "bg-indigo-100", label: "Received & Inspecting" };
    case "REFUNDED":
      return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100", label: "Refunded" };
    case "REJECTED":
      return { icon: AlertCircle, color: "text-red-500", bg: "bg-red-100", label: "Rejected" };
    default:
      return { icon: AlertCircle, color: "text-stone-500", bg: "bg-stone-100", label: status };
  }
};

export default function ReturnsPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-inria text-3xl text-stone-900 mb-1">Returns</h1>
          <p className="font-inter text-sm text-stone-500">Track your return requests and refunds.</p>
        </div>
        
        <Link 
          href="/returns"
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-stone-50 font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors"
        >
          <RotateCcw size={16} /> Initiate Return
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {DUMMY_RETURNS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-stone-200 border-dashed rounded-xl bg-stone-50">
            <RotateCcw className="text-stone-300 mb-4" size={48} />
            <h3 className="font-inria text-xl text-stone-900 mb-2">No Returns Yet</h3>
            <p className="font-inter text-stone-500 text-center max-w-sm">
              You haven't requested any returns. Need to return an item? Check our returns policy.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-6">Return ID</th>
                  <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-6">Order ID</th>
                  <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-6">Date</th>
                  <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-6">Status</th>
                  <th className="font-inter font-semibold text-xs text-stone-500 uppercase tracking-wider py-4 px-6 text-right">Refund Amount</th>
                  <th className="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {DUMMY_RETURNS.map((ret) => {
                  const statusInfo = getStatusConfig(ret.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={ret.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-4 px-6 font-inter font-medium text-sm text-stone-900">{ret.id}</td>
                      <td className="py-4 px-6 font-inter text-sm text-stone-600">
                        <Link href={`/account/orders/${ret.orderId}`} className="hover:text-stone-900 hover:underline">
                          {ret.orderId}
                        </Link>
                      </td>
                      <td className="py-4 px-6 font-inter text-sm text-stone-600">{ret.date}</td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                          <StatusIcon size={14} />
                          {statusInfo.label}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-inter text-sm text-stone-900 text-right font-medium">
                        {ret.refundAmount}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors font-inter text-sm font-medium">
                          <Eye size={16} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
