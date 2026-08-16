"use client";

import { MoreVertical } from "lucide-react";
import { useState } from "react";

export default function RevenueChart() {
  const [activeTab, setActiveTab] = useState("Koko");

  const tabs = ["Koko", "Mintpay", "OnePay"];

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
      <div className="px-6 flex gap-5 border-b border-stone-100">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-col items-start pb-4 gap-2 border-b-2 transition-colors ${
              activeTab === tab 
                ? "border-blue-600" 
                : "border-transparent hover:border-stone-200"
            }`}
          >
            <span className={`font-bold text-[24px] leading-[22px] ${activeTab === tab ? "text-stone-900" : "text-stone-400"}`}>
              {tab === "Koko" ? "Rs.245K" : tab === "Mintpay" ? "Rs.184K" : "Rs.152K"}
            </span>
            <span className={`font-medium text-[14px] leading-[20px] tracking-[-0.02em] ${activeTab === tab ? "text-stone-500" : "text-stone-400"}`}>
              {tab}
            </span>
          </button>
        ))}
      </div>

      {/* Chart Placeholder Area */}
      <div className="flex-1 flex items-center justify-center relative p-6">
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-x-6 top-6 bottom-10 flex flex-col justify-between z-0">
          {[1,2,3,4,5,6].map(i => (
             <div key={i} className="w-full h-px bg-stone-100"></div>
          ))}
        </div>

        {/* Decorative Bar Chart Placeholder */}
        <div className="absolute inset-x-12 bottom-10 h-[180px] flex items-end justify-between z-10 px-8">
           {[40, 70, 45, 90, 65, 80, 50, 100].map((h, i) => (
             <div key={i} className="w-12 bg-blue-600/10 rounded-t-sm relative group cursor-pointer hover:bg-blue-600/20 transition-colors" style={{ height: `${h}%` }}>
               <div className="absolute bottom-0 w-full bg-blue-600 rounded-t-sm" style={{ height: `${h * 0.7}%` }}></div>
             </div>
           ))}
        </div>

      </div>

    </div>
  );
}
