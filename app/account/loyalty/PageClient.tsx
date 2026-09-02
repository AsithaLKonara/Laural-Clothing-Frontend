"use client";

import { Award, ChevronRight, Gift, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useLoyaltyProfile } from "@/hooks/useLoyalty";
import { format } from "date-fns";

export default function LoyaltyPage() {
  const { data, isLoading } = useLoyaltyProfile();

  if (isLoading) {
    return <div className="p-10 animate-pulse">Loading loyalty profile...</div>;
  }

  if (!data || !data.account) {
    return <div className="p-10 text-stone-500">Could not load loyalty profile.</div>;
  }

  const { account, transactions, tierProgress } = data;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Loyalty Header Card */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 md:p-10 relative overflow-hidden flex flex-col gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-stone-800 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-stone-800 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-800 text-stone-300 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              <Award size={14} /> {account.tier} Tier
            </div>
            <p className="font-inter text-stone-400 font-medium uppercase tracking-widest text-xs mb-1">Available Points</p>
            <div className="flex items-baseline gap-2">
              <span className="font-signature text-6xl">{account.points.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="bg-stone-800/50 backdrop-blur-md rounded-xl p-4 border border-white/10 w-full md:w-64">
            <div className="flex justify-between items-center font-inter text-sm mb-2">
              <span className="text-stone-300">Next Tier: {tierProgress.nextTier || 'Max'}</span>
              <span className="text-white font-semibold">{tierProgress.nextTierMinPoints ? `${tierProgress.nextTierMinPoints.toLocaleString()} pts` : '-'}</span>
            </div>
            <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${tierProgress.progressPercentage}%` }}></div>
            </div>
            <p className="font-inter text-xs text-stone-400 mt-2 text-right">{tierProgress.pointsNeeded > 0 ? `${tierProgress.pointsNeeded.toLocaleString()} pts remaining` : 'Max Tier Reached'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Available Rewards */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-inria text-2xl text-stone-900">Available Rewards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Reward Card */}
            <div className={`border rounded-xl p-5 flex flex-col justify-between transition-colors ${account.points >= 500 ? 'border-stone-200 bg-white hover:border-stone-300' : 'border-stone-100 bg-stone-50 opacity-60'}`}>
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-900">
                  <Gift size={24} />
                </div>
                <span className="font-inter font-bold text-lg text-stone-900">500 pts</span>
              </div>
              <div>
                <h4 className="font-inter font-bold text-stone-900 mb-1">LKR 500 Off</h4>
                <p className="font-inter text-sm text-stone-500 mb-4">Get LKR 500 off your next purchase of LKR 2000 or more.</p>
                <button className="w-full py-2.5 bg-stone-900 text-stone-50 font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50" disabled={account.points < 500}>
                  Redeem at Checkout
                </button>
              </div>
            </div>

            {/* Reward Card */}
            <div className={`border rounded-xl p-5 flex flex-col justify-between transition-colors ${account.points >= 1000 ? 'border-stone-200 bg-white hover:border-stone-300' : 'border-stone-100 bg-stone-50 opacity-60'}`}>
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-900">
                  <Gift size={24} />
                </div>
                <span className="font-inter font-bold text-lg text-stone-900">1000 pts</span>
              </div>
              <div>
                <h4 className="font-inter font-bold text-stone-900 mb-1">LKR 1000 Off</h4>
                <p className="font-inter text-sm text-stone-500 mb-4">Get LKR 1000 off your next purchase of LKR 5000 or more.</p>
                <button className="w-full py-2.5 bg-stone-900 text-stone-50 font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50" disabled={account.points < 1000}>
                  Redeem at Checkout
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
              {transactions?.length === 0 ? (
                <div className="p-4 text-sm text-stone-500 font-inter text-center">No transactions yet.</div>
              ) : (
                transactions?.map((tx: any) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${['EARNED', 'MIGRATED'].includes(tx.type) ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {['EARNED', 'MIGRATED'].includes(tx.type) ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div>
                        <p className="font-inter font-medium text-sm text-stone-900">{tx.reason || tx.type}</p>
                        <p className="font-inter text-xs text-stone-500">{format(new Date(tx.createdAt), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <span className={`font-inter font-bold text-sm ${['EARNED', 'MIGRATED'].includes(tx.type) ? 'text-emerald-600' : 'text-stone-900'}`}>
                      {['EARNED', 'MIGRATED'].includes(tx.type) ? '+' : ''}{tx.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
