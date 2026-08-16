"use client";

import React, { useEffect } from "react";
import { Printer, X } from "lucide-react";

interface BarcodePrintModalProps {
  productSku: string;
  productName: string;
  onClose: () => void;
}

export default function BarcodePrintModal({ productSku, productName, onClose }: BarcodePrintModalProps) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:bg-white print:p-0">
      
      {/* Modal Container - Hidden when printing */}
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col print:hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
          <h2 className="font-inter font-bold text-lg text-stone-900">Print Barcode</h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center justify-center gap-6 bg-stone-100">
          
          {/* Barcode Preview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 flex flex-col items-center gap-3 w-64">
            <span className="font-inter font-bold text-xs text-stone-900 text-center leading-tight">{productName}</span>
            {/* Dummy Barcode Graphic */}
            <div className="w-full h-16 flex items-stretch gap-[2px]">
              <div className="w-1 bg-black"></div>
              <div className="w-2 bg-black"></div>
              <div className="w-1 bg-black"></div>
              <div className="w-0.5 bg-black"></div>
              <div className="w-1.5 bg-black"></div>
              <div className="w-1 bg-black"></div>
              <div className="w-3 bg-black"></div>
              <div className="w-0.5 bg-black"></div>
              <div className="w-1 bg-black"></div>
              <div className="w-2 bg-black"></div>
              <div className="w-0.5 bg-black"></div>
              <div className="w-1 bg-black"></div>
              <div className="w-1.5 bg-black"></div>
              <div className="w-2 bg-black"></div>
              <div className="w-1 bg-black"></div>
              <div className="w-0.5 bg-black"></div>
              <div className="w-1.5 bg-black"></div>
              <div className="w-2 bg-black"></div>
              <div className="w-1 bg-black"></div>
            </div>
            <span className="font-mono text-sm tracking-[0.2em] text-stone-700">{productSku}</span>
          </div>

        </div>

        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-stone-200 text-stone-700 font-inter font-medium text-sm rounded-lg hover:bg-stone-50 transition-colors shadow-sm">
            Cancel
          </button>
          <button onClick={handlePrint} className="px-6 py-2 bg-stone-900 text-white font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors shadow-sm flex items-center gap-2">
            <Printer size={16} /> Print Label
          </button>
        </div>
      </div>

      {/* Print View - Only visible when printing */}
      <div className="hidden print:flex flex-col items-center justify-center w-[200px] h-[100px] bg-white text-black p-2 border-2 border-dashed border-gray-300">
        <span className="font-sans font-bold text-[10px] text-center leading-tight mb-1 line-clamp-1">{productName}</span>
        {/* Dummy Barcode Graphic for Print */}
        <div className="w-full h-8 flex items-stretch gap-[1px]">
          <div className="w-1 bg-black"></div>
          <div className="w-2 bg-black"></div>
          <div className="w-1 bg-black"></div>
          <div className="w-[1px] bg-black"></div>
          <div className="w-1.5 bg-black"></div>
          <div className="w-1 bg-black"></div>
          <div className="w-3 bg-black"></div>
          <div className="w-[1px] bg-black"></div>
          <div className="w-1 bg-black"></div>
          <div className="w-2 bg-black"></div>
          <div className="w-[1px] bg-black"></div>
          <div className="w-1 bg-black"></div>
          <div className="w-1.5 bg-black"></div>
          <div className="w-2 bg-black"></div>
          <div className="w-1 bg-black"></div>
          <div className="w-[1px] bg-black"></div>
          <div className="w-1.5 bg-black"></div>
          <div className="w-2 bg-black"></div>
          <div className="w-1 bg-black"></div>
        </div>
        <span className="font-mono text-[10px] tracking-widest mt-1">{productSku}</span>
      </div>

    </div>
  );
}
