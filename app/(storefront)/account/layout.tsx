import Link from "next/link";
import { User, ShoppingBag, MapPin, Heart, Award, LogOut } from "lucide-react";

export default function CustomerAccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12 flex flex-col md:flex-row gap-12 w-full">
      
      {/* Account Sidebar */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-8">
        <div>
          <h2 className="font-signature text-3xl text-stone-900 mb-1">My Account</h2>
          <p className="font-inter text-sm text-stone-500">Welcome back, Kasun</p>
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/account" className="flex items-center gap-3 px-4 py-3 bg-stone-100 text-stone-900 font-inter font-semibold text-sm rounded-lg">
            <User size={18} /> Overview
          </Link>
          <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 hover:text-stone-900 font-inter font-medium text-sm rounded-lg transition-colors">
            <ShoppingBag size={18} /> Orders & Returns
          </Link>
          <Link href="/account/loyalty" className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 hover:text-stone-900 font-inter font-medium text-sm rounded-lg transition-colors">
            <Award size={18} /> Loyalty Rewards
          </Link>
          <Link href="/account/wishlist" className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 hover:text-stone-900 font-inter font-medium text-sm rounded-lg transition-colors">
            <Heart size={18} /> Wishlist
          </Link>
          <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 hover:text-stone-900 font-inter font-medium text-sm rounded-lg transition-colors">
            <MapPin size={18} /> Addresses
          </Link>
          
          <div className="h-px bg-stone-200 my-2"></div>
          
          <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 font-inter font-medium text-sm rounded-lg transition-colors text-left">
            <LogOut size={18} /> Sign Out
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>

    </div>
  );
}
