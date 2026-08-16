"use client";

import React, { useState } from "react";
import { X, Phone, MapPin, Truck, CheckCircle2, Trash2, ArrowRightLeft, Search, PlusCircle, MinusCircle, User } from "lucide-react";

interface PosExchangeTicketProps {
  isMobileCartOpen: boolean;
  setIsMobileCartOpen: (open: boolean) => void;
  cart: any[];
  updateQty: (id: number, delta: number) => void;
  clearCart: () => void;
}

export default function PosExchangeTicket({ isMobileCartOpen, setIsMobileCartOpen, cart, updateQty, clearCart }: PosExchangeTicketProps) {
  const [returnedItems, setReturnedItems] = useState<any[]>([]);
  const [scanQuery, setScanQuery] = useState("");
  
  const [deliveryMethod, setDeliveryMethod] = useState<"In-Store" | "Delivery">("In-Store");
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  
  const [isDispatching, setIsDispatching] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReturnScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (scanQuery.trim()) {
      const newItem = {
        id: `EX-${Math.floor(Math.random() * 10000)}`,
        name: "Returned Scanned Item",
        price: 2500, // mock price
        qty: 1
      };
      setReturnedItems(prev => [...prev, newItem]);
      setScanQuery("");
    }
  };

  const removeReturnedItem = (id: string) => {
    setReturnedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
    }, 1500);
  };
  
  const [isProcessing, setIsProcessing] = useState(false);

  const returnTotal = returnedItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  // Extract number from cart prices if they are strings like "5,000"
  const cartTotal = cart.reduce((acc, item) => {
    const p = typeof item.price === 'string' ? Number(item.price.replace(/,/g, "")) : item.price;
    return acc + (p * item.qty);
  }, 0);

  const deliveryFee = deliveryMethod === "Delivery" ? 400 : 0;
  const netTotal = cartTotal + deliveryFee - returnTotal;

  if (success) {
    return (
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[420px] bg-surface flex flex-col shrink-0 shadow-2xl lg:shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-50 lg:z-0 lg:static transform transition-transform duration-300 lg:translate-x-0 ${isMobileCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-background">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="font-inter font-bold text-2xl text-foreground mb-2">Exchange Complete!</h2>
          <p className="font-inter text-muted mb-8 text-sm">
            {deliveryMethod === "Delivery" 
              ? `Exchange arranged. Fardar will pickup the return and drop off the new items.`
              : `Instore exchange successful. Receipt printed.`}
          </p>
          <button 
            onClick={() => { setSuccess(false); clearCart(); setReturnedItems([]); setPhone(""); setCustomerName(""); setAddress(""); setIsMobileCartOpen(false); }}
            className="w-full py-4 bg-primary text-white rounded-xl font-inter font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
          >
            New Exchange
          </button>
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
          Exchange Ticket
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        
        {/* Section 1: Returned Items */}
        <div className="p-4 flex flex-col gap-3 bg-red-50/50">
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
              <p className="text-xs font-inter text-muted text-center py-2">No returns scanned</p>
            ) : (
              returnedItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-red-100 rounded-lg shadow-sm">
                  <div>
                    <p className="font-inter font-bold text-sm text-foreground">{item.name}</p>
                    <p className="font-inter text-xs text-red-600 font-bold">-Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeReturnedItem(item.id)} className="text-muted hover:text-error transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 2: New Items */}
        <div className="p-4 flex flex-col gap-3 bg-emerald-50/50 flex-1 border-t border-border">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <PlusCircle size={16} />
            <h3 className="font-inter font-bold text-sm uppercase tracking-wider">New Items</h3>
          </div>
          
          <div className="flex flex-col gap-2">
            {cart.length === 0 ? (
              <p className="text-xs font-inter text-muted text-center py-8">Select products from grid</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-emerald-100 rounded-lg shadow-sm">
                  <div className="flex-1">
                    <p className="font-inter font-bold text-sm text-foreground">{item.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full bg-background border border-border font-bold text-muted flex items-center justify-center hover:bg-surface">-</button>
                      <span className="font-inter font-bold text-sm w-4 text-center text-foreground">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full bg-background border border-border font-bold text-muted flex items-center justify-center hover:bg-surface">+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-inter text-sm text-emerald-600 font-bold">
                      +Rs. {(Number(typeof item.price === 'string' ? item.price.replace(/,/g, "") : item.price) * item.qty).toLocaleString()}
                    </p>
                    <button onClick={() => updateQty(item.id, -item.qty)} className="text-muted hover:text-error transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Logistics Toggle (if remote exchange) */}
        <div className="p-4 bg-background border-t border-border flex flex-col gap-3">
          <label className="font-inter text-xs font-semibold text-muted uppercase tracking-wider">Exchange Method</label>
          <div className="flex bg-surface p-1 rounded-lg border border-border">
            <button 
              onClick={() => setDeliveryMethod("In-Store")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-inter font-semibold rounded-md transition-all ${deliveryMethod === 'In-Store' ? 'bg-background text-foreground shadow-sm border border-border' : 'text-muted'}`}
            >
              <MapPin size={14}/> In-Store
            </button>
            <button 
              onClick={() => setDeliveryMethod("Delivery")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-inter font-semibold rounded-md transition-all ${deliveryMethod === 'Delivery' ? 'bg-background text-foreground shadow-sm border border-border' : 'text-muted'}`}
            >
              <Truck size={14}/> Courier Exchange
            </button>
          </div>

          {deliveryMethod === "Delivery" && (
            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 mt-2">
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Customer Phone"
                  className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm font-inter text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-muted" />
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Delivery Address"
                  rows={2}
                  className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm font-inter text-foreground focus:outline-none focus:border-accent resize-none"
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Totals & Action */}
      <div className="border-t border-border bg-surface p-5 shrink-0 flex flex-col gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        
        <div className="flex flex-col gap-1.5 font-inter text-sm">
          <div className="flex justify-between text-red-600">
            <span>Returns Value</span>
            <span>- Rs. {returnTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-emerald-600">
            <span>New Items Value</span>
            <span>+ Rs. {cartTotal.toLocaleString()}</span>
          </div>
          {deliveryMethod === "Delivery" && (
            <div className="flex justify-between text-muted">
              <span>Exchange Courier Fee</span>
              <span>+ Rs. {deliveryFee.toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex justify-between items-end mt-2 pt-2 border-t border-border">
            <span className="text-lg font-bold text-foreground">Net {netTotal >= 0 ? "Due" : "Refund"}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-muted">Rs.</span>
              <span className={`text-2xl font-bold tracking-tight ${netTotal > 0 ? 'text-primary' : netTotal < 0 ? 'text-red-600' : 'text-foreground'}`}>
                {Math.abs(netTotal).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleProcess}
          disabled={isProcessing || (returnedItems.length === 0 && cart.length === 0)}
          className={`w-full text-white rounded-xl py-4 transition-colors font-inter font-bold shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:bg-stone-300 ${netTotal > 0 ? 'bg-primary hover:bg-primary-hover shadow-primary/20' : netTotal < 0 ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-stone-900 hover:bg-stone-800'}`}
        >
          {isProcessing ? "Processing..." : netTotal > 0 ? "Charge Difference" : netTotal < 0 ? "Refund Difference" : "Complete Even Exchange"}
        </button>

      </div>
    </div>
  );
}
