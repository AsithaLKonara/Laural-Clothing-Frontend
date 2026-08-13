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
    <div className="flex flex-col w-full h-full bg-slate-100">
      
      {/* POS Header */}
      <div className="h-[60px] bg-primary text-white flex items-center justify-between px-6 shrink-0 shadow-md z-10">
        <div className="flex items-center gap-6">
          <h1 className="font-bold text-lg tracking-widest uppercase flex items-center gap-2">
            <LayoutGrid size={18} /> LAURAL POS
          </h1>
          <div className="flex items-center gap-4 text-sm font-inter text-slate-300">
            <span>Kandy Branch</span>
            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
            <span>Terminal #02</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm font-inter text-slate-300">Shift OPEN</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-inter text-slate-300 border-l border-primary-hover pl-6">
            <span>Cashier: Kasun</span>
          </div>
          <button 
            onClick={toggleFullscreen}
            className="flex items-center gap-2 bg-primary-hover hover:bg-slate-700 px-3 py-1.5 rounded transition-colors text-sm font-inter ml-4"
          >
            <Maximize size={14} />
            {isFullscreen ? "Exit Full Screen" : "Full Screen"}
          </button>
        </div>
      </div>

      {/* Main POS Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Products (2/3 width) */}
        <div className="flex-1 flex flex-col bg-surface overflow-hidden border-r border-border">
          
          {/* Search Bar */}
          <div className="p-4 border-b border-border shrink-0">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="text" 
                placeholder="Search products, scan barcode..."
                className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 text-lg font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                autoFocus
              />
            </div>
          </div>

          {/* Categories */}
          <div className="px-4 py-3 border-b border-border flex gap-2 overflow-x-auto shrink-0 scrollbar-hide">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                className={`px-6 py-3 rounded-lg font-inter font-semibold text-sm whitespace-nowrap transition-colors ${
                  idx === 0 ? "bg-primary text-white" : "bg-background text-muted hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => (
                <button 
                  key={p.id}
                  className="bg-surface border border-border rounded-xl p-4 flex flex-col h-[140px] hover:border-accent hover:shadow-md transition-all text-left active:scale-95"
                >
                  <span className="font-inter font-bold text-foreground text-sm leading-snug line-clamp-2 mb-auto">
                    {p.name}
                  </span>
                  <div className="flex justify-between items-end w-full mt-2">
                    <span className="font-inter font-bold text-accent text-lg">
                      {p.price}
                    </span>
                    <span className="font-inter text-xs text-muted bg-background px-2 py-1 rounded">
                      In Stock
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Cart & Payment (1/3 width, fixed 400px min) */}
        <div className="w-[420px] bg-surface flex flex-col shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-0 relative">
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {[1, 2].map(i => (
              <div key={i} className="flex flex-col bg-slate-50 border border-border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-inter font-bold text-foreground leading-snug pr-4">Black Oversized T-Shirt</span>
                  <button className="text-muted hover:text-error transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button className="w-8 h-8 rounded-full bg-surface border border-border font-bold text-muted flex items-center justify-center hover:bg-background">-</button>
                    <span className="font-inter font-bold text-lg w-4 text-center text-foreground">2</span>
                    <button className="w-8 h-8 rounded-full bg-surface border border-border font-bold text-muted flex items-center justify-center hover:bg-background">+</button>
                  </div>
                  <span className="font-inter font-bold text-foreground">5,000</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals & Payment Actions */}
          <div className="border-t border-primary-hover bg-primary p-6 shrink-0 flex flex-col gap-4 shadow-[0_-10px_20px_rgba(23,37,84,0.1)]">
            
            <div className="flex flex-col gap-2 font-inter text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>10,000</span>
              </div>
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-600</span>
              </div>
              <div className="flex justify-between items-end mt-2 pt-2 border-t border-primary-hover">
                <span className="text-xl font-bold text-white">Total</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-slate-300">Rs.</span>
                  <span className="text-4xl font-bold text-white tracking-tight">9,400</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="flex flex-col items-center justify-center gap-2 bg-primary-hover hover:bg-primary border border-primary-hover rounded-xl py-4 transition-colors">
                <CreditCard size={24} className="text-white" />
                <span className="font-inter font-bold text-sm text-white">Card</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 bg-accent hover:bg-teal-700 rounded-xl py-4 transition-colors shadow-lg shadow-accent/20">
                <Banknote size={24} className="text-white" />
                <span className="font-inter font-bold text-sm text-white">Cash</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <button className="bg-primary-hover hover:bg-slate-700 text-white font-inter font-semibold py-3 rounded-lg text-sm transition-colors border border-primary-hover">
                Hold Cart
              </button>
              <button className="bg-error-soft hover:bg-red-200 text-error hover:text-red-700 font-inter font-semibold py-3 rounded-lg text-sm transition-colors border border-error/20">
                Clear All
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
