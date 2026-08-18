"use client";

import React, { useState } from "react";
import { X, ArrowRightLeft } from "lucide-react";

interface StockTransferModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function StockTransferModal({ onClose, onSuccess }: StockTransferModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fromBranch, setFromBranch] = useState("Online");
  const [toBranch, setToBranch] = useState("Colombo");
  const [sku, setSku] = useState("");
  const [qty, setQty] = useState(1);

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-stone-50 shrink-0">
          <div>
            <h2 className="font-inter font-bold text-xl text-stone-900 flex items-center gap-2">
              <ArrowRightLeft className="text-stone-700" size={24} /> Request Stock Transfer
            </h2>
            <p className="font-inter text-sm text-stone-500 mt-1">Move inventory between branches.</p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-stone-100 flex-1 flex flex-col gap-6">
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col gap-5">
            
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="flex flex-col gap-2">
                <label className="font-inter text-sm font-semibold text-stone-700">From Branch</label>
                <select 
                  value={fromBranch}
                  onChange={(e) => setFromBranch(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50 text-stone-900"
                >
                  <option>Online</option>
                  <option>Colombo</option>
                  <option>Kandy</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-inter text-sm font-semibold text-stone-700">To Branch</label>
                <select 
                  value={toBranch}
                  onChange={(e) => setToBranch(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50 text-stone-900"
                >
                  <option>Online</option>
                  <option>Colombo</option>
                  <option>Kandy</option>
                </select>
              </div>
              
              {/* Arrow Icon in Middle */}
              <div className="absolute top-9 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-400 z-10 shadow-sm">
                <ArrowRightLeft size={14} />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="font-inter text-sm font-semibold text-stone-700">Product SKU</label>
              <input 
                type="text" 
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. LC-TSH-001-M"
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-inter text-sm font-semibold text-stone-700">Quantity to Transfer</label>
              <input 
                type="number" 
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                min="1"
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-white"
              />
            </div>

            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm font-inter mt-2">
              <span className="mt-0.5">ℹ️</span>
              <p>This request will require approval from a Super Admin before stock is deducted.</p>
            </div>

          </div>
        </div>

        <div className="p-6 border-t border-stone-200 bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} disabled={isProcessing} className="px-5 py-2.5 bg-white border border-stone-200 text-stone-700 font-inter font-medium text-sm rounded-lg hover:bg-stone-50 transition-colors shadow-sm disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleProcess} disabled={isProcessing || !sku || fromBranch === toBranch} className="px-8 py-2.5 bg-stone-900 text-white font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
            {isProcessing ? "Submitting..." : "Request Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
}
