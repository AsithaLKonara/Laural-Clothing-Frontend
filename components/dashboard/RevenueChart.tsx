"use client";

import { MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";

interface GatewayData {
  gw: string;
  amount: number;
  count: number;
  pct: number;
}

export default function RevenueChart({ data }: { data?: GatewayData[] }) {
  const [activeTab, setActiveTab] = useState<string>("");

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `Rs. ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `Rs. ${(value / 1000).toFixed(1)}K`;
    return `Rs. ${value.toFixed(0)}`;
  };

  // Default to top 3 gateways
  const tabs = data?.slice(0, 3) || [];
  
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].gw);
    }
  }, [tabs, activeTab]);

  return (
    <div className="flex-1 min-w-[600px] h-[476px] bg-white border border-stone-200 rounded-2xl shadow-sm flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-6 flex justify-between items-start shrink-0">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold text-[18px] leading-[26px] tracking-[-0.02em] text-stone-900">
            Revenue Overview
          </h3>
          <p className="font-medium text-[14px] leading-[20px] tracking-[-0.02em] text-stone-500">
            Payment gateway performance over time
          </p>
        </div>
        <button className="text-stone-400 hover:text-stone-600 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 flex gap-5 border-b border-stone-100 min-h-[75px]">
        {tabs.length > 0 ? tabs.map(tab => (
          <button 
            key={tab.gw}
            onClick={() => setActiveTab(tab.gw)}
            className={`flex flex-col items-start pb-4 gap-2 border-b-2 transition-colors ${
              activeTab === tab.gw 
                ? "border-blue-600" 
                : "border-transparent hover:border-stone-200"
            }`}
          >
            <span className={`font-bold text-[24px] leading-[22px] ${activeTab === tab.gw ? "text-stone-900" : "text-stone-400"}`}>
              {formatCurrency(tab.amount)}
            </span>
            <span className={`font-medium text-[14px] leading-[20px] tracking-[-0.02em] ${activeTab === tab.gw ? "text-stone-500" : "text-stone-400"}`}>
              {tab.gw}
            </span>
          </button>
        )) : (
          <div className="text-stone-400 text-sm py-4">No data available</div>
        )}
      </div>

      {/* Chart Area */}
      <div className="flex-1 flex items-center justify-center relative p-6">
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-x-6 top-6 bottom-10 flex flex-col justify-between z-0">
          {[1,2,3,4,5,6].map(i => (
             <div key={i} className="w-full h-px bg-stone-100"></div>
          ))}
        </div>

        {/* Dynamic Bar Chart based on Gateway Data */}
        <div className="absolute inset-x-12 bottom-10 h-[180px] flex items-end justify-around z-10 px-8">
           {tabs.length > 0 ? data?.map((g, i) => (
             <div key={g.gw} className="w-16 bg-blue-600/10 rounded-t-sm relative group cursor-pointer hover:bg-blue-600/20 transition-colors" style={{ height: `${Math.max(10, g.pct * 2)}%` }} title={`${g.gw}: ${g.pct}%`}>
               <div className="absolute bottom-0 w-full bg-blue-600 rounded-t-sm" style={{ height: `${g.pct}%` }}></div>
             </div>
           )) : (
             <div className="text-stone-400 text-sm">No transactions to display</div>
           )}
        </div>

      </div>

    </div>
  );
}
