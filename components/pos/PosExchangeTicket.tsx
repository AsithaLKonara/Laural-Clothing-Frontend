"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Trash2, Search, MinusCircle } from "lucide-react";
import { useGenerateVoucher } from "@/hooks/usePos";
import { useScanBarcode } from "@/hooks/useProducts";
import { globalDialog } from "@/store/dialog.store";

import { orderService } from "@/services/order.service";

interface PosExchangeTicketProps {
  isMobileCartOpen: boolean;
  setIsMobileCartOpen: (open: boolean) => void;
  cart: any[];
  updateQty: (id: number, delta: number) => void;
  clearCart: () => void;
}

export default function PosExchangeTicket({ isMobileCartOpen, setIsMobileCartOpen }: PosExchangeTicketProps) {
  const [returnedItems, setReturnedItems] = useState<any[]>([]);
  const [scanQuery, setScanQuery] = useState("");
  
  const [orderQuery, setOrderQuery] = useState("");
  const [loadedOrder, setLoadedOrder] = useState<any>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);

  const scanBarcodeMutation = useScanBarcode();

  const handleOrderLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setIsProcessing(true);
    try {
      const { data } = await orderService.getOrderById(orderQuery.trim());
      setLoadedOrder(data);
      setReturnedItems([]);
    } catch (error) {
      globalDialog.alert("Order not found or error loading order.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReturnScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loadedOrder) {
      globalDialog.alert("Please lookup an order first.");
      return;
    }
    
    if (scanQuery.trim()) {
      try {
        const product = await scanBarcodeMutation.mutateAsync(scanQuery.trim());
        if (product && product.variants) {
          const matchingVariant = product.variants.find((v: any) => v.sku === scanQuery.trim());
          if (matchingVariant) {
            const orderItem = loadedOrder.items.find((i: any) => i.variantId === matchingVariant.id);
            if (!orderItem) {
               globalDialog.alert("Item not found in this order.");
               return;
            }
            const alreadyScanned = returnedItems.filter(i => i.id === matchingVariant.id).length;
            const availableToReturn = orderItem.quantity - orderItem.returnedQty;
            if (alreadyScanned >= availableToReturn) {
               globalDialog.alert(`Cannot return more than ${availableToReturn} of this item.`);
               return;
            }
            
            setReturnedItems(prev => [...prev, {
              id: matchingVariant.id,
              name: `${product.name} - ${matchingVariant.color || 'Default'} ${matchingVariant.size || ''}`.trim(),
              price: orderItem.priceAtPurchase, // Use original purchase price
              qty: 1
            }]);
            setScanQuery("");
          } else {
            globalDialog.alert("Barcode matched a product but no specific variant SKU.");
          }
        }
      } catch (err) {
        console.error(err);
        globalDialog.alert("Product not found or invalid barcode.");
      }
    }
  };

  const removeReturnedItem = (id: string) => {
    setReturnedItems(prev => prev.filter(item => item.id !== id));
  };

  const returnTotal = returnedItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const generateVoucherMutation = useGenerateVoucher();

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      const result = await generateVoucherMutation.mutateAsync({
        branchId: "BR-001", // Hardcoded for now
        returnedItems: returnedItems.map(i => ({ variantId: i.id, qty: i.qty })),
        value: returnTotal,
        orderId: loadedOrder.id
      });
      setVoucherCode(result.code);
      setSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[420px] bg-surface flex flex-col shrink-0 shadow-2xl lg:shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-50 lg:z-0 lg:static transform transition-transform duration-300 lg:translate-x-0 ${isMobileCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-background">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="font-inter font-bold text-2xl text-foreground mb-2">Exchange Voucher Issued!</h2>
          <p className="font-inter text-muted mb-6 text-sm">
            Successfully generated an exchange voucher for Rs. {returnTotal.toLocaleString()}.
            Inventory has been automatically restocked.
          </p>
          <div className="bg-white border-2 border-dashed border-stone-300 p-6 rounded-xl flex flex-col items-center gap-2 mb-8 shadow-sm w-full">
            <p className="text-sm font-bold tracking-widest text-stone-500 uppercase">Barcode Scan Code</p>
            <p className="font-mono text-3xl font-bold tracking-widest">{voucherCode}</p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={() => window.print()}
              className="w-full py-4 bg-surface border border-border text-foreground font-inter font-bold rounded-xl hover:bg-background transition-colors shadow-sm"
            >
              Print Voucher Receipt
            </button>
            <button 
              onClick={() => { setSuccess(false); setReturnedItems([]); setVoucherCode(null); setIsMobileCartOpen(false); setOrderQuery(""); setLoadedOrder(null); }}
              className="w-full py-4 bg-primary text-white rounded-xl font-inter font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
            >
              New Exchange
            </button>
          </div>
        </div>

        {/* Hidden Printable Receipt */}
        <div className="print-receipt print-only bg-white text-black p-4 font-mono text-sm leading-snug mx-auto">
          <div className="text-center flex flex-col items-center gap-1 mb-4">
            <h2 className="font-bold text-xl tracking-widest">LAURAL</h2>
            <span className="text-xs">EXCHANGE VOUCHER</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Code:</span>
            <span className="font-bold">{voucherCode}</span>
          </div>
          <div className="border-t border-dashed border-black my-2"></div>
          <div className="flex justify-between font-bold text-lg my-2">
            <span>VOUCHER VALUE:</span>
            <span>Rs. {returnTotal.toFixed(2)}</span>
          </div>
          <div className="border-t border-dashed border-black my-2"></div>
          <div className="text-center mt-6 text-xs">
            Scan this code at checkout to redeem.<br/>
            Valid at all branches.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-surface flex flex-col shrink-0 shadow-2xl lg:shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-50 lg:z-0 lg:static transform transition-transform duration-300 lg:translate-x-0 ${isMobileCartOpen ? "translate-x-0" : "translate-x-full"}`}>
      
      {/* Header */}
      <div className="p-4 border-b border-border bg-background flex justify-between items-center shrink-0 h-[60px]">
        <h2 className="font-inter font-bold text-lg flex items-center gap-2">
          <button className="lg:hidden p-1 -ml-1 text-muted" onClick={() => setIsMobileCartOpen(false)}>
            <X size={20} />
          </button>
          Generate Exchange Voucher
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Order Lookup Section */}
        <div className="p-4 border-b border-border bg-white flex flex-col gap-3">
          <form onSubmit={handleOrderLookup} className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="Enter Order ID to exchange..."
              className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-sm font-inter text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </form>
          {loadedOrder && (
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700">
              <span className="font-bold">Loaded Order:</span> {loadedOrder.orderNumber}
              <br/>
              <span className="text-stone-500">{loadedOrder.items.length} items purchased.</span>
            </div>
          )}
        </div>
        
        {/* Section 1: Returned Items */}
        <div className={`p-4 flex flex-col gap-3 bg-red-50/50 flex-1 ${!loadedOrder ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2 text-red-700 mb-1">
            <MinusCircle size={16} />
            <h3 className="font-inter font-bold text-sm uppercase tracking-wider">Returning Items</h3>
          </div>
          
          <form onSubmit={handleReturnScan} className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              value={scanQuery}
              onChange={(e) => setScanQuery(e.target.value)}
              placeholder="Scan barcode to return..."
              className="w-full bg-white border border-red-200 rounded-lg pl-9 pr-3 py-2 text-sm font-inter text-foreground focus:outline-none focus:ring-1 focus:ring-red-400"
            />
          </form>

          <div className="flex flex-col gap-2 mt-2">
            {returnedItems.length === 0 ? (
              <p className="text-xs font-inter text-muted text-center py-4">No returns scanned</p>
            ) : (
              returnedItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-red-100 rounded-lg shadow-sm">
                  <div>
                    <p className="font-inter font-bold text-sm text-foreground">{item.name}</p>
                    <p className="font-inter text-xs text-red-600 font-bold">Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeReturnedItem(item.id)} className="text-muted hover:text-error transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Totals & Action */}
      <div className="border-t border-border bg-surface p-5 shrink-0 flex flex-col gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        
        <div className="flex flex-col gap-1.5 font-inter text-sm">
          <div className="flex justify-between items-end mt-2 pt-2 border-t border-border">
            <span className="text-lg font-bold text-foreground">Voucher Value</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-muted">Rs.</span>
              <span className="text-2xl font-bold tracking-tight text-primary">
                {returnTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleProcess}
          disabled={isProcessing || returnedItems.length === 0}
          className={`w-full text-white rounded-xl py-4 transition-colors font-inter font-bold shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:bg-stone-300 bg-primary hover:bg-primary-hover shadow-primary/20`}
        >
          {isProcessing ? "Generating..." : "Generate Voucher"}
        </button>

      </div>
    </div>
  );
}
