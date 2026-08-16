"use client";

import React, { useState } from "react";
import { X, PackagePlus, AlertTriangle } from "lucide-react";

interface InventoryAdjustmentModalProps {
  type: "receive" | "deduct";
  onClose: () => void;
  onSuccess: () => void;
}

export default function InventoryAdjustmentModal({ type, onClose, onSuccess }: InventoryAdjustmentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [branch, setBranch] = useState("Online");
  const [sku, setSku] = useState("");
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState("");
  const [supplierPo, setSupplierPo] = useState("");

  const isReceive = type === "receive";

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
              {isReceive ? <PackagePlus className="text-emerald-600" size={24} /> : <AlertTriangle className="text-red-600" size={24} />}
              {isReceive ? "Receive New Stock" : "Report Damage / Loss"}
            </h2>
            <p className="font-inter text-sm text-stone-500 mt-1">
              {isReceive ? "Intake stock from a supplier purchase order." : "Deduct stock that cannot be sold."}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-stone-100 flex-1 flex flex-col gap-6">
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col gap-5">
            
            <div className="flex flex-col gap-2">
              <label className="font-inter text-sm font-semibold text-stone-700">Target Branch</label>
              <select 
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50 text-stone-900"
              >
                <option>Online</option>
                <option>Colombo</option>
                <option>Kandy</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-inter text-sm font-semibold text-stone-700">Product SKU</label>
                <input 
                  type="text" 
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. LC-TSH-001"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-inter text-sm font-semibold text-stone-700">Quantity</label>
                <input 
                  type="number" 
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  min="1"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-white"
                />
              </div>
            </div>

            {isReceive ? (
              <div className="flex flex-col gap-2">
                <label className="font-inter text-sm font-semibold text-stone-700">Supplier / PO Number</label>
                <input 
                  type="text" 
                  value={supplierPo}
                  onChange={(e) => setSupplierPo(e.target.value)}
                  placeholder="e.g. PO-2026-08-12-A"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-white"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="font-inter text-sm font-semibold text-stone-700">Reason Code</label>
                <select 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50 text-stone-900"
                >
                  <option value="" disabled>Select reason...</option>
                  <option value="Damage (In Store)">Damage (In Store)</option>
                  <option value="Damage (Transit)">Damage (Transit)</option>
                  <option value="Lost / Missing">Lost / Missing</option>
                  <option value="Theft">Theft</option>
                  <option value="Expired / Degradation">Expired / Degradation</option>
                </select>
              </div>
            )}

          </div>
        </div>

        <div className="p-6 border-t border-stone-200 bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} disabled={isProcessing} className="px-5 py-2.5 bg-white border border-stone-200 text-stone-700 font-inter font-medium text-sm rounded-lg hover:bg-stone-50 transition-colors shadow-sm disabled:opacity-50">
            Cancel
          </button>
          <button 
            onClick={handleProcess} 
            disabled={isProcessing || !sku || (isReceive && !supplierPo) || (!isReceive && !reason)} 
            className={`px-8 py-2.5 text-white font-inter font-medium text-sm rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 ${isReceive ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isProcessing ? "Processing..." : isReceive ? "Add to Stock" : "Deduct from Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
