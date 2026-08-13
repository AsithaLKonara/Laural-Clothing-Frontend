"use client";

import { Maximize, Search, Trash2, CreditCard, Banknote, LayoutGrid } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function POSPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const categories = ["All", "T-Shirts", "Shirts", "Dresses", "Pants", "Accessories"];
  const products = [
    { id: 1, name: "Black Oversized T-Shirt", price: "2,500" },
    { id: 2, name: "Classic Linen Shirt", price: "4,900" },
    { id: 3, name: "Summer Floral Dress", price: "6,500" },
    { id: 4, name: "Cargo Pants", price: "5,200" },
    { id: 5, name: "Ribbed Tank Top", price: "1,800" },
    { id: 6, name: "Denim Jacket", price: "8,500" },
    { id: 7, name: "Pleated Skirt", price: "4,200" },
    { id: 8, name: "Basic White Tee", price: "2,000" },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-stone-100">
      
      {/* POS Header */}
      <div className="h-[60px] bg-stone-900 text-white flex items-center justify-between px-6 shrink-0 shadow-md z-10">
        <div className="flex items-center gap-6">
          <h1 className="font-bold text-lg tracking-widest uppercase flex items-center gap-2">
            <LayoutGrid size={18} /> LAURAL POS
          </h1>
          <div className="flex items-center gap-4 text-sm font-inter text-stone-300">
            <span>Kandy Branch</span>
            <span className="w-1 h-1 rounded-full bg-stone-600"></span>
            <span>Terminal #02</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-inter text-stone-300">Shift OPEN</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-inter text-stone-300 border-l border-stone-700 pl-6">
            <span>Cashier: Kasun</span>
          </div>
          <button 
            onClick={toggleFullscreen}
            className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded transition-colors text-sm font-inter ml-4"
          >
            <Maximize size={14} />
            {isFullscreen ? "Exit Full Screen" : "Full Screen"}
          </button>
        </div>
      </div>

      {/* Main POS Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Products (2/3 width) */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden border-r border-stone-200">
          
          {/* Search Bar */}
          <div className="p-4 border-b border-stone-200 shrink-0">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search products, scan barcode..."
                className="w-full bg-stone-100 border border-stone-200 rounded-xl py-4 pl-12 pr-4 text-lg font-inter text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Categories */}
          <div className="px-4 py-3 border-b border-stone-200 flex gap-2 overflow-x-auto shrink-0 scrollbar-hide">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                className={`px-6 py-3 rounded-lg font-inter font-semibold text-sm whitespace-nowrap transition-colors ${
                  idx === 0 ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-4 bg-stone-50">
            <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => (
                <button 
                  key={p.id}
                  className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col h-[140px] hover:border-blue-500 hover:shadow-md transition-all text-left active:scale-95"
                >
                  <span className="font-inter font-bold text-stone-900 text-sm leading-snug line-clamp-2 mb-auto">
                    {p.name}
                  </span>
                  <div className="flex justify-between items-end w-full mt-2">
                    <span className="font-inter font-bold text-blue-600 text-lg">
                      {p.price}
                    </span>
                    <span className="font-inter text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded">
                      In Stock
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Cart & Payment (1/3 width, fixed 400px min) */}
        <div className="w-[420px] bg-white flex flex-col shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-0 relative">
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {[1, 2].map(i => (
              <div key={i} className="flex flex-col bg-stone-50 border border-stone-200 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-inter font-bold text-stone-900 leading-snug pr-4">Black Oversized T-Shirt</span>
                  <button className="text-stone-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button className="w-8 h-8 rounded-full bg-white border border-stone-300 font-bold text-stone-600 flex items-center justify-center hover:bg-stone-100">-</button>
                    <span className="font-inter font-bold text-lg w-4 text-center">2</span>
                    <button className="w-8 h-8 rounded-full bg-white border border-stone-300 font-bold text-stone-600 flex items-center justify-center hover:bg-stone-100">+</button>
                  </div>
                  <span className="font-inter font-bold text-stone-900">5,000</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals & Payment Actions */}
          <div className="border-t border-stone-200 bg-white p-6 shrink-0 flex flex-col gap-4">
            
            <div className="flex flex-col gap-2 font-inter">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span>10,000</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-600</span>
              </div>
              <div className="flex justify-between items-end mt-2 pt-2 border-t border-stone-200">
                <span className="text-xl font-bold text-stone-900">Total</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-stone-500">Rs.</span>
                  <span className="text-4xl font-bold text-stone-900 tracking-tight">9,400</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="flex flex-col items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl py-4 transition-colors">
                <CreditCard size={24} className="text-stone-700" />
                <span className="font-inter font-bold text-sm text-stone-900">Card</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 rounded-xl py-4 transition-colors shadow-lg shadow-stone-900/20">
                <Banknote size={24} className="text-white" />
                <span className="font-inter font-bold text-sm text-white">Cash</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <button className="bg-stone-100 hover:bg-stone-200 text-stone-900 font-inter font-semibold py-3 rounded-lg text-sm transition-colors">
                Hold Cart
              </button>
              <button className="bg-stone-100 hover:bg-red-50 text-red-600 hover:text-red-700 font-inter font-semibold py-3 rounded-lg text-sm transition-colors">
                Clear All
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
