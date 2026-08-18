"use client";

import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";

export default function WishlistPage() {
  const { data: response, isLoading } = useProducts({ skip: 0, take: 4 });
  const wishlistItems = response?.data || [];

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-inria text-2xl md:text-3xl text-stone-900 mb-1">Wishlist</h1>
          <p className="font-inter text-sm text-stone-500">Items you've saved for later.</p>
        </div>
      </div>

      {!isLoading && wishlistItems.length === 0 ? (
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
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative group w-full max-w-[245px] h-[380px] bg-stone-100 animate-pulse rounded-lg"></div>
            ))
          ) : (
            wishlistItems.map((item: Product) => (
              <div key={item.id} className="relative group w-full max-w-[245px]">
                <ProductCard product={item} />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm z-[25] opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
