"use client";

import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

const DUMMY_WISHLIST = [
  {
    id: "W-1",
    name: "Classic Silk Blouse",
    price: "LKR 8,500",
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=800&auto=format&fit=crop",
    slug: "classic-silk-blouse",
    inStock: true
  },
  {
    id: "W-2",
    name: "Linen Trousers",
    price: "LKR 12,000",
    image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=800&auto=format&fit=crop",
    slug: "linen-trousers",
    inStock: false
  },
  {
    id: "W-3",
    name: "Minimalist Shift Dress",
    price: "LKR 14,500",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop",
    slug: "minimalist-shift-dress",
    inStock: true
  }
];

export default function WishlistPage() {
  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-inria text-2xl md:text-3xl text-stone-900 mb-1">Wishlist</h1>
          <p className="font-inter text-sm text-stone-500">Items you've saved for later.</p>
        </div>
      </div>

      {DUMMY_WISHLIST.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-stone-200 border-dashed rounded-xl bg-stone-50">
          <Heart className="text-stone-300 mb-4" size={48} />
          <h3 className="font-inria text-xl text-stone-900 mb-2">Your wishlist is empty</h3>
          <p className="font-inter text-stone-500 text-center max-w-sm mb-6">
            Save items you love and keep track of them here.
          </p>
          <Link href="/shop" className="px-6 py-2.5 bg-stone-900 text-white font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {DUMMY_WISHLIST.map((item) => (
            <div key={item.id} className="relative group w-full max-w-[245px]">
              <ProductCard />
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm z-[25] opacity-0 group-hover:opacity-100">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
