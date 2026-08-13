import Link from "next/link";
import { ChevronRight, Package, Box } from "lucide-react";

export default function CustomerAccountPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Loyalty Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-stone-800 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="flex flex-col gap-2 relative z-10 text-center md:text-left">
          <span className="font-inter text-stone-400 font-medium uppercase tracking-widest text-xs">Loyalty Balance</span>
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="font-signature text-5xl">2,450</span>
            <span className="font-inter text-stone-300">Points</span>
          </div>
          <p className="font-inter text-sm text-stone-400 mt-2">You are 550 points away from Gold Tier!</p>
        </div>

        <Link href="/account/loyalty" className="bg-white text-stone-900 hover:bg-stone-100 px-6 py-3 rounded-lg font-inter font-bold text-sm transition-colors relative z-10 shrink-0">
          Redeem Rewards
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-inter font-bold text-lg text-stone-900">Recent Orders</h3>
          <Link href="/account/orders" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors flex items-center">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex flex-col">
            
            {/* Order Item */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b border-stone-100 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 shrink-0">
                  <Package size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-inter font-bold text-stone-900">Order #LC-10241</span>
                  <span className="font-inter text-sm text-stone-500">2 items • Rs. 8,500</span>
                </div>
              </div>
              <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded">Processing</span>
                  <span className="px-3 py-1 bg-stone-100 text-stone-800 text-xs font-bold uppercase tracking-wider rounded">Paid via Koko</span>
                </div>
                <Link href="/account/orders/LC-10241" className="text-sm font-medium text-blue-600 hover:underline">Track Order</Link>
              </div>
            </div>

            {/* Order Item */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 shrink-0">
                  <Box size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-inter font-bold text-stone-900">Order #LC-09942</span>
                  <span className="font-inter text-sm text-stone-500">1 item • Rs. 4,900</span>
                </div>
              </div>
              <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded">Delivered</span>
                  <span className="px-3 py-1 bg-stone-100 text-stone-800 text-xs font-bold uppercase tracking-wider rounded">Paid via Mintpay</span>
                </div>
                <Link href="/account/orders/LC-09942" className="text-sm font-medium text-blue-600 hover:underline">View Details</Link>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
