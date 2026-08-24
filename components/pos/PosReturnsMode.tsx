"use client";

import { useState } from "react";
import { Search, Package, RotateCcw, CheckCircle2, ChevronRight, X, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function PosReturnsMode() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderFound, setOrderFound] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]); // Changed to store full item objects
  const [refundMethod, setRefundMethod] = useState<"CASH" | "CARD" | "STORE_CREDIT">("CASH");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const DUMMY_ORDER = {
    id: "LC-09942",
    customer: "Amila Silva",
    date: "2026-08-10",
    items: [
      { id: "ITEM-1", name: "Black Oversized T-Shirt", size: "M", price: 2500, image: "/products/default.jpg", returned: false },
      { id: "ITEM-2", name: "Classic Linen Shirt", size: "L", price: 4900, image: "/products/hover.jpg", returned: true },
      { id: "ITEM-3", name: "Summer Floral Dress", size: "S", price: 6500, image: "/products/default.jpg", returned: false },
    ]
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length > 3) {
      if (searchQuery.toUpperCase().startsWith("LC-")) {
        setOrderFound(true);
        // Automatically add all eligible items from the order to the return list for demo purposes
        setSelectedItems([]);
      } else {
        // Treat as a direct barcode scan
        setOrderFound(true);
        const newItem = {
          id: `SCAN-${Math.floor(Math.random() * 1000)}`,
          name: "Scanned Item",
          size: "O/S",
          price: 3500,
          image: "/products/default.jpg",
          returned: false,
          isScanned: true
        };
        setSelectedItems(prev => [...prev, newItem]);
        setSearchQuery(""); // clear for next scan
      }
      setIsSuccess(false);
    }
  };

  const toggleItem = (item: any) => {
    setSelectedItems(prev => 
      prev.find(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]
    );
  };

  const calculateRefund = () => {
    return selectedItems.reduce((sum, item) => sum + item.price, 0);
  };

  const handleCompleteReturn = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="font-signature text-4xl text-foreground mb-2">Return Completed</h2>
        <p className="font-inter text-muted mb-8 text-center max-w-md">
          Successfully refunded Rs. {calculateRefund().toLocaleString()} to {refundMethod}. 
          Inventory has been automatically updated for restockable items.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-surface border border-border text-foreground font-inter font-medium rounded-xl hover:bg-background transition-colors shadow-sm">
            Print Return Receipt
          </button>
          <button onClick={() => { setOrderFound(false); setSearchQuery(""); setIsSuccess(false); }} className="px-6 py-3 bg-primary text-white font-inter font-medium rounded-xl hover:bg-primary-hover transition-colors shadow-sm">
            Process Another Return
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      
      {/* Left Side: Order Lookup & Items */}
      <div className="flex-1 flex flex-col bg-surface overflow-hidden border-r border-border">
        
        {/* Search Bar */}
        <div className="p-6 border-b border-border shrink-0 bg-background">
          <h2 className="font-inter font-bold text-lg text-foreground mb-4">Find Order to Return</h2>
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Scan receipt barcode or enter Order ID (e.g. LC-09942)"
              className="w-full bg-surface border border-border rounded-xl py-4 pl-12 pr-32 text-lg font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              autoFocus
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-lg font-inter font-medium hover:bg-primary-hover transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Order Results */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          {!orderFound ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50">
              <RotateCcw size={64} className="text-muted mb-4" />
              <p className="font-inter font-medium text-lg text-foreground">Waiting for order lookup...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 max-w-3xl">
              
              <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl">
                <div>
                  <p className="font-inter font-bold text-lg text-foreground">Order #{DUMMY_ORDER.id}</p>
                  <p className="font-inter text-sm text-muted">Purchased on {DUMMY_ORDER.date} • by {DUMMY_ORDER.customer}</p>
                </div>
                <div className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest rounded-md">
                  Eligible for Return
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="font-inter font-bold text-foreground">Select Items to Return</h3>
                
                {/* Render Scanned Items if any */}
                {selectedItems.filter(i => i.isScanned).map(item => (
                  <div key={item.id} className="flex items-start gap-4 p-4 border rounded-xl transition-all bg-primary/5 border-primary shadow-sm">
                    <div className="pt-2">
                      <input 
                        type="checkbox" 
                        checked={true}
                        onChange={() => toggleItem(item)}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="w-16 h-20 relative bg-stone-100 rounded-md overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="100px" className="object-cover" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-inter font-bold text-foreground">{item.name}</p>
                          <p className="font-inter text-sm text-muted">Direct Barcode Scan</p>
                        </div>
                        <span className="font-inter font-bold text-foreground">Rs. {item.price.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="flex flex-col gap-1">
                          <select className="bg-background border border-border rounded-md text-sm p-2 outline-none focus:border-primary">
                            <option>New with tags (Restockable)</option>
                            <option>Damaged (Write-off)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Render Dummy Order Items */}
                {DUMMY_ORDER.items.map(item => (
                  <div key={item.id} className={`flex items-start gap-4 p-4 border rounded-xl transition-all ${item.returned ? 'bg-background border-border opacity-60' : selectedItems.find(i => i.id === item.id) ? 'bg-primary/5 border-primary shadow-sm' : 'bg-surface border-border hover:border-muted'}`}>
                    
                    <div className="pt-2">
                      <input 
                        type="checkbox" 
                        disabled={item.returned}
                        checked={!!selectedItems.find(i => i.id === item.id)}
                        onChange={() => toggleItem(item)}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary disabled:opacity-50"
                      />
                    </div>
                    
                    <div className="w-16 h-20 relative bg-stone-100 rounded-md overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="100px" className="object-cover" />
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-inter font-bold text-foreground">{item.name}</p>
                          <p className="font-inter text-sm text-muted">Size {item.size}</p>
                        </div>
                        <span className="font-inter font-bold text-foreground">Rs. {item.price.toLocaleString()}</span>
                      </div>

                      {item.returned ? (
                        <div className="mt-2 text-xs font-inter font-medium text-error bg-error-soft px-2 py-1 rounded inline-block self-start">
                          Already Returned
                        </div>
                      ) : selectedItems.find(i => i.id === item.id) ? (
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="flex flex-col gap-1">
                            <label className="font-inter text-xs font-medium text-muted">Condition</label>
                            <select className="bg-background border border-border rounded-md text-sm p-2 outline-none focus:border-primary">
                              <option>New with tags (Restockable)</option>
                              <option>Damaged (Write-off)</option>
                              <option>Worn (Write-off)</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-inter text-xs font-medium text-muted">Reason</label>
                            <select className="bg-background border border-border rounded-md text-sm p-2 outline-none focus:border-primary">
                              <option>Changed mind</option>
                              <option>Wrong size</option>
                              <option>Defective</option>
                            </select>
                          </div>
                        </div>
                      ) : null}
                    </div>

                  </div>
                ))}

              </div>
            </div>
          )}
        </div>

      </div>

      {/* Right Side: Refund Actions (1/3 width, fixed 400px min) */}
      <div className="fixed inset-y-0 right-0 w-[420px] bg-surface flex flex-col shrink-0 shadow-2xl z-50 transform transition-transform duration-300 translate-x-0 border-l border-border">
        
        <div className="p-6 border-b border-border bg-background flex flex-col justify-center shrink-0 h-[80px]">
          <h2 className="font-inter font-bold text-xl text-foreground flex items-center gap-2">
            <RotateCcw size={24} className="text-primary" />
            Return Summary
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          <div className="flex flex-col gap-2 font-inter">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted">Items Selected</span>
              <span className="font-bold text-foreground">{selectedItems.length}</span>
            </div>
            <div className="flex justify-between items-center py-4">
              <span className="text-lg font-bold text-foreground">Total Refund</span>
              <span className="text-3xl font-black text-emerald-600">
                Rs. {calculateRefund().toLocaleString()}
              </span>
            </div>
          </div>

          {selectedItems.length > 0 && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="font-inter font-bold text-sm text-muted uppercase tracking-wider">Refund Method</h3>
              
              <button 
                onClick={() => setRefundMethod("CASH")}
                className={`p-4 border rounded-xl flex items-center gap-4 transition-all text-left ${refundMethod === 'CASH' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:border-muted'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${refundMethod === 'CASH' ? 'border-primary' : 'border-muted'}`}>
                  {refundMethod === 'CASH' && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div>
                  <p className="font-inter font-bold text-foreground">Cash Refund</p>
                  <p className="font-inter text-xs text-muted">Opens cash drawer instantly</p>
                </div>
              </button>

              <button 
                onClick={() => setRefundMethod("CARD")}
                className={`p-4 border rounded-xl flex items-center gap-4 transition-all text-left ${refundMethod === 'CARD' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:border-muted'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${refundMethod === 'CARD' ? 'border-primary' : 'border-muted'}`}>
                  {refundMethod === 'CARD' && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div>
                  <p className="font-inter font-bold text-foreground">Card Reversal</p>
                  <p className="font-inter text-xs text-muted">Send amount back to original card</p>
                </div>
              </button>

              <button 
                onClick={() => setRefundMethod("STORE_CREDIT")}
                className={`p-4 border rounded-xl flex items-center gap-4 transition-all text-left ${refundMethod === 'STORE_CREDIT' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:border-muted'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${refundMethod === 'STORE_CREDIT' ? 'border-primary' : 'border-muted'}`}>
                  {refundMethod === 'STORE_CREDIT' && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div>
                  <p className="font-inter font-bold text-foreground">Store Credit</p>
                  <p className="font-inter text-xs text-muted">Issue as points to customer account</p>
                </div>
              </button>
            </div>
          )}

        </div>

        <div className="p-6 border-t border-border bg-surface shrink-0">
          <button 
            disabled={selectedItems.length === 0 || isProcessing}
            onClick={handleCompleteReturn}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl py-4 transition-colors shadow-lg shadow-emerald-600/20"
          >
            {isProcessing ? (
              <span className="font-inter font-bold text-lg">Processing...</span>
            ) : (
              <>
                <span className="font-inter font-bold text-lg">Complete Return</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
