"use client";

import React, { useState } from "react";
import { X, PackagePlus, AlertTriangle, Search } from "lucide-react";
import { useAdjustStock, useInventory } from "@/hooks/useInventory";

interface InventoryAdjustmentModalProps {
  type: "receive" | "deduct";
  onClose: () => void;
  onSuccess: () => void;
}

export default function InventoryAdjustmentModal({ type, onClose, onSuccess }: InventoryAdjustmentModalProps) {
  const [variantId, setVariantId] = useState("");
  const [skuSearch, setSkuSearch] = useState("");
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState("");
  const [supplierPo, setSupplierPo] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const isReceive = type === "receive";
  const adjustMutation = useAdjustStock();

  // Live search inventory for SKU picker
  const { data: searchResults } = useInventory(undefined, skuSearch, undefined, 1);

  const selectedVariant = searchResults?.data?.find((v: any) => v.variantId === variantId);

  const handleSelectVariant = (v: any) => {
    setVariantId(v.variantId);
    setSkuSearch(v.sku);
    setShowDropdown(false);
  };

  const handleProcess = async () => {
    if (!variantId) return;
    await adjustMutation.mutateAsync({
      variantId,
      branchId: "BR-001",
      type: isReceive ? "RECEIVE" : "DEDUCT",
      quantity: qty,
      reason: isReceive ? supplierPo : reason,
    });
    onSuccess();
  };

  const isProcessing = adjustMutation.isPending;
  const canSubmit = variantId && qty > 0 && (isReceive ? !!supplierPo : !!reason);

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

        <div className="p-6 overflow-y-auto bg-stone-100 flex-1 flex flex-col gap-5">
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col gap-5">

            {/* SKU Search */}
            <div className="flex flex-col gap-2 relative">
              <label className="font-inter text-sm font-semibold text-stone-700">Product / SKU</label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={skuSearch}
                  onChange={e => { setSkuSearch(e.target.value); setVariantId(""); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search SKU or product name..."
                  className="w-full pl-9 border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-white"
                />
              </div>

              {showDropdown && skuSearch && (
                <div className="absolute top-full left-0 right-0 z-10 bg-white border border-stone-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {(searchResults?.data ?? []).length === 0 ? (
                    <p className="p-3 text-sm text-stone-400 text-center">No results</p>
                  ) : (
                    (searchResults?.data ?? []).map((v: any) => (
                      <button
                        key={v.variantId}
                        onClick={() => handleSelectVariant(v)}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-stone-50 transition-colors text-left"
                      >
                        <div>
                          <p className="font-mono text-xs font-medium text-stone-900">{v.sku}</p>
                          <p className="text-xs text-stone-500">{v.productName} — {v.name}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${v.isOutOfStock ? "bg-red-100 text-red-700" : "bg-stone-100 text-stone-700"}`}>
                          {v.quantity} in stock
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected variant pill */}
            {selectedVariant && (
              <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5">
                <div>
                  <p className="font-inter text-sm font-semibold text-stone-900">{selectedVariant.productName}</p>
                  <p className="font-mono text-xs text-stone-400">{selectedVariant.sku} · {selectedVariant.name}</p>
                </div>
                <span className="text-sm font-bold text-stone-700">{selectedVariant.quantity} on hand</span>
              </div>
            )}

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <label className="font-inter text-sm font-semibold text-stone-700">Quantity</label>
              <input
                type="number"
                value={qty}
                onChange={e => setQty(Number(e.target.value))}
                min="1"
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-white"
              />
            </div>

            {/* Receive: PO number | Deduct: reason */}
            {isReceive ? (
              <div className="flex flex-col gap-2">
                <label className="font-inter text-sm font-semibold text-stone-700">Supplier / PO Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={supplierPo}
                  onChange={e => setSupplierPo(e.target.value)}
                  placeholder="e.g. PO-2026-08-12-A"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-white"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="font-inter text-sm font-semibold text-stone-700">Reason Code <span className="text-red-500">*</span></label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
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

            {adjustMutation.isError && (
              <p className="text-red-600 text-sm font-inter text-center">Failed to process. Please try again.</p>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-stone-200 bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} disabled={isProcessing} className="px-5 py-2.5 bg-white border border-stone-200 text-stone-700 font-inter font-medium text-sm rounded-lg hover:bg-stone-50 transition-colors shadow-sm disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleProcess}
            disabled={isProcessing || !canSubmit}
            className={`px-8 py-2.5 text-white font-inter font-medium text-sm rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 ${isReceive ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}
          >
            {isProcessing ? "Processing..." : isReceive ? "Add to Stock" : "Deduct from Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
