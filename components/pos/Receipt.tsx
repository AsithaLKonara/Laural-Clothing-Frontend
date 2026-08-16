"use client";

import { forwardRef } from "react";

const Receipt = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div ref={ref} className="w-[300px] bg-white text-black p-4 font-mono text-sm leading-snug mx-auto shadow-md">
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-1 mb-4">
        <h2 className="font-bold text-xl tracking-widest">LAURAL</h2>
        <span className="text-xs">Kandy Branch, 123 Main Street</span>
        <span className="text-xs">Tel: +94 77 123 4567</span>
      </div>

      <div className="border-t border-dashed border-black my-2"></div>
      
      {/* Order Info */}
      <div className="flex flex-col gap-1 text-xs mb-2">
        <div className="flex justify-between">
          <span>Date: 2026-08-16 14:30</span>
        </div>
        <div className="flex justify-between">
          <span>Receipt: #ORD-2026-0816</span>
        </div>
        <div className="flex justify-between">
          <span>Cashier: Kasun</span>
        </div>
      </div>

      <div className="border-t border-dashed border-black my-2"></div>

      {/* Items Header */}
      <div className="flex justify-between text-xs font-bold mb-1">
        <span className="w-[50%]">Item</span>
        <span className="w-[15%] text-center">Qty</span>
        <span className="w-[35%] text-right">Amount</span>
      </div>
      
      <div className="border-t border-dashed border-black my-2"></div>

      {/* Items */}
      <div className="flex flex-col gap-2 text-xs">
        <div className="flex justify-between">
          <div className="w-[50%] flex flex-col pr-1">
            <span className="truncate">Black Oversized T-Shirt</span>
            <span className="text-[10px] text-stone-500">Size: M | Black</span>
          </div>
          <span className="w-[15%] text-center">2</span>
          <span className="w-[35%] text-right">5,000.00</span>
        </div>
        
        <div className="flex justify-between">
          <div className="w-[50%] flex flex-col pr-1">
            <span className="truncate">Classic Linen Shirt</span>
            <span className="text-[10px] text-stone-500">Size: L | White</span>
          </div>
          <span className="w-[15%] text-center">1</span>
          <span className="w-[35%] text-right">4,900.00</span>
        </div>
      </div>

      <div className="border-t border-dashed border-black my-2"></div>

      {/* Totals */}
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>9,900.00</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>- 500.00</span>
        </div>
      </div>

      <div className="border-t border-dashed border-black my-2"></div>

      <div className="flex justify-between text-sm font-bold my-1">
        <span>TOTAL</span>
        <span>Rs. 9,400.00</span>
      </div>

      <div className="border-t border-dashed border-black my-2"></div>

      {/* Payment */}
      <div className="flex flex-col gap-1 text-xs mb-4">
        <div className="flex justify-between">
          <span>Method:</span>
          <span>Cash</span>
        </div>
        <div className="flex justify-between">
          <span>Tendered:</span>
          <span>10,000.00</span>
        </div>
        <div className="flex justify-between">
          <span>Change:</span>
          <span>600.00</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center flex flex-col items-center gap-2 text-xs">
        <span className="font-bold">Thank you for shopping!</span>
        <span className="text-[10px] px-2 text-center text-stone-600">
          Returns accepted within 14 days with original tags and receipt.
        </span>
        
        <div className="mt-2 flex flex-col items-center">
          {/* Fake Barcode */}
          <div className="flex h-10 w-48 bg-black items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 flex justify-between px-1">
                <div className="w-1 h-full bg-white"></div>
                <div className="w-2 h-full bg-white"></div>
                <div className="w-1 h-full bg-white"></div>
                <div className="w-3 h-full bg-white"></div>
                <div className="w-1 h-full bg-white"></div>
                <div className="w-2 h-full bg-white"></div>
                <div className="w-1 h-full bg-white"></div>
                <div className="w-1 h-full bg-white"></div>
                <div className="w-3 h-full bg-white"></div>
                <div className="w-2 h-full bg-white"></div>
                <div className="w-1 h-full bg-white"></div>
                <div className="w-2 h-full bg-white"></div>
                <div className="w-1 h-full bg-white"></div>
                <div className="w-1 h-full bg-white"></div>
                <div className="w-3 h-full bg-white"></div>
                <div className="w-2 h-full bg-white"></div>
                <div className="w-1 h-full bg-white"></div>
             </div>
          </div>
          <span className="text-[10px] mt-1 tracking-widest">ORD20260816</span>
        </div>

        <span className="text-[8px] mt-4 text-stone-400">Powered by Laural POS</span>
      </div>

    </div>
  );
});

Receipt.displayName = "Receipt";

export default Receipt;
