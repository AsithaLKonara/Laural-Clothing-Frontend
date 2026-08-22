"use client";

import { Award, ChevronRight, Gift, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";

const DUMMY_HISTORY = [
  { id: "TX-1", date: "2026-08-14", type: "Earned", amount: "+150", reason: "Order #LC-10241" },
  { id: "TX-2", date: "2026-07-28", type: "Earned", amount: "+49", reason: "Order #LC-09942" },
  { id: "TX-3", date: "2026-07-01", type: "Spent", amount: "-500", reason: "Redeemed LKR 500 Off" },
  { id: "TX-4", date: "2026-06-15", type: "Earned", amount: "+152", reason: "Order #LC-09855" },
];

export default function LoyaltyPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Loyalty Header Card */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 md:p-10 relative overflow-hidden flex flex-col gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-stone-800 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-stone-800 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-800 text-stone-300 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              <Award size={14} /> Silver Tier
            </div>
            <p className="font-inter text-stone-400 font-medium uppercase tracking-widest text-xs mb-1">Available Points</p>
            <div className="flex items-baseline gap-2">
              <span className="font-signature text-6xl">2,450</span>
            </div>
          </div>
          
          <div className="bg-stone-800/50 backdrop-blur-md rounded-xl p-4 border border-white/10 w-full md:w-64">
            <div className="flex justify-between items-center font-inter text-sm mb-2">
              <span className="text-stone-300">Next Tier: Gold</span>
              <span className="text-white font-semibold">3,000 pts</span>
            </div>
            <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: "81%" }}></div>
            </div>
            <p className="font-inter text-xs text-stone-400 mt-2 text-right">550 pts remaining</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Available Rewards */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-inria text-2xl text-stone-900">Available Rewards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Reward Card */}
            <div className="border border-stone-200 bg-white rounded-xl p-5 flex flex-col justify-between hover:border-stone-300 transition-colors">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-900">
                  <Gift size={24} />
                </div>
                <span className="font-inter font-bold text-lg text-stone-900">500 pts</span>
              </div>
              <div>
                <h4 className="font-inter font-bold text-stone-900 mb-1">LKR 500 Off</h4>
                <p className="font-inter text-sm text-stone-500 mb-4">Get LKR 500 off your next purchase of LKR 2000 or more.</p>
                <button className="w-full py-2.5 bg-stone-900 text-stone-50 font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors">
                  Redeem
                </button>
              </div>
            </div>

            {/* Reward Card */}
            <div className="border border-stone-200 bg-white rounded-xl p-5 flex flex-col justify-between hover:border-stone-300 transition-colors">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-900">
                  <Gift size={24} />
                </div>
                <span className="font-inter font-bold text-lg text-stone-900">1000 pts</span>
              </div>
              <div>
                <h4 className="font-inter font-bold text-stone-900 mb-1">LKR 1000 Off</h4>
                <p className="font-inter text-sm text-stone-500 mb-4">Get LKR 1000 off your next purchase of LKR 5000 or more.</p>
                <button className="w-full py-2.5 bg-stone-900 text-stone-50 font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors">
                  Redeem
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Point History */}
        <div className="flex flex-col gap-4">
          <h3 className="font-inria text-2xl text-stone-900">Points History</h3>
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="flex flex-col divide-y divide-stone-100">
              {DUMMY_HISTORY.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'Earned' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {tx.type === 'Earned' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <p className="font-inter font-medium text-sm text-stone-900">{tx.reason}</p>
                      <p className="font-inter text-xs text-stone-500">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-inter font-bold text-sm ${tx.type === 'Earned' ? 'text-emerald-600' : 'text-stone-900'}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
