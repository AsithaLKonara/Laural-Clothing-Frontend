"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Search Header Container */}
      <div className="w-full bg-[#FAFAF9] pt-8 pb-6 px-4 md:px-12 animate-in slide-in-from-top-4 duration-300 shadow-xl">
        <div className="max-w-[1280px] mx-auto w-full flex flex-col gap-6">
          
          <div className="flex justify-between items-center w-full">
            <h2 className="font-poppins font-medium text-[20px] text-[#1C1917]">Search</h2>
            <button 
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-200 transition-colors text-stone-500 hover:text-[#1C1917]"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative w-full h-[60px]">
            <input 
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, categories..."
              className="w-full h-full border-b-2 border-stone-300 bg-transparent font-poppins text-[20px] md:text-[24px] text-[#1C1917] outline-none focus:border-[#C19A5B] transition-colors pl-0 pr-12 placeholder:text-stone-400"
            />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#C19A5B] transition-colors">
              <Search size={28} />
            </button>
          </div>
          
          {/* Popular Suggestions */}
          {!searchQuery && (
            <div className="flex flex-col gap-4 mt-4">
              <span className="font-urbanist font-medium text-[13px] text-stone-500 uppercase tracking-widest">Popular Searches</span>
              <div className="flex flex-wrap gap-3">
                {["Linen Shirts", "Summer Collection", "Maxi Dresses", "Accessories"].map((term) => (
                  <button 
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-4 py-2 bg-stone-100 rounded-full font-poppins text-[14px] text-stone-600 hover:bg-stone-200 hover:text-[#1C1917] transition-colors border border-stone-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dummy Results */}
          {searchQuery && (
            <div className="flex flex-col mt-4">
              <span className="font-urbanist font-medium text-[13px] text-stone-500 uppercase tracking-widest mb-6">Products</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <Link href="/product/vesper-long-sleeve-top" onClick={onClose} key={item} className="flex flex-col group cursor-pointer">
                    <div className="relative w-full aspect-[3/4] bg-stone-200 mb-3 overflow-hidden rounded-md">
                      <Image 
                        src={`/products/product_${item}.jpg`} 
                        alt="Product result" 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-poppins font-medium text-[14px] text-[#1C1917] group-hover:text-[#C19A5B] transition-colors">Vesper Long Sleeve Top</h4>
                    <span className="font-poppins text-[14px] text-stone-500">Rs. 5190.00</span>
                  </Link>
                ))}
              </div>
              <Link 
                href={`/search?q=${searchQuery}`} 
                onClick={onClose}
                className="mt-8 font-poppins text-[15px] text-[#1C1917] border-b border-[#1C1917] self-start hover:text-[#C19A5B] hover:border-[#C19A5B] transition-colors pb-1"
              >
                View all results for "{searchQuery}"
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
