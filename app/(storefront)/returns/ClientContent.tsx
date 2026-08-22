"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Package, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useVerifyOrderForReturn, useCreateReturn } from "@/hooks/useReturns";
import { api } from "@/services/api";

export default function ClientContent() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"search" | "select" | "reason" | "success">("search");
  
  const [searchParams, setSearchParams] = useState({ orderNumber: "", email: "" });
  const [error, setError] = useState("");
  
  const [selectedItems, setSelectedItems] = useState<{ id: string, quantity: number }[]>([]);
  const [itemReasons, setItemReasons] = useState<Record<string, { reason: string, details: string }>>({});

  // We manually fetch using api.get instead of hook for more control on click
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const createReturnMutation = useCreateReturn();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber && email) {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await api.get('/returns/verify', { params: { orderNumber, email } });
        setOrderData(data);
        setStep("select");
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to find order.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleItem = (itemId: string, maxQty: number) => {
    setSelectedItems(prev => {
      const exists = prev.find(p => p.id === itemId);
      if (exists) {
        return prev.filter(p => p.id !== itemId);
      }
      return [...prev, { id: itemId, quantity: 1 }]; // Default select 1
    });
  };

  const handleChangeQty = (itemId: string, qty: number) => {
    setSelectedItems(prev => prev.map(p => p.id === itemId ? { ...p, quantity: qty } : p));
  };

  const handleReasonChange = (itemId: string, field: 'reason' | 'details', value: string) => {
    setItemReasons(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId] || { reason: '', details: '' },
        [field]: value
      }
    }));
  };

  const handleSubmitReturn = async () => {
    if (selectedItems.length === 0 || !orderData) return;
    
    // Check if all selected items have a reason
    for (const item of selectedItems) {
      if (!itemReasons[item.id]?.reason) {
        setError("Please provide a reason for all selected items.");
        return;
      }
    }

    try {
      setError("");
      const payload = {
        orderId: orderData.orderId,
        items: selectedItems.map(item => ({
          orderItemId: item.id,
          quantity: item.quantity,
          reason: itemReasons[item.id].reason,
          details: itemReasons[item.id].details || ""
        }))
      };
      
      await createReturnMutation.mutateAsync(payload);
      setStep("success");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit return request.");
    }
  };

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-background pt-[83px]">
      
      {/* Header Banner */}
      <div className="w-full bg-primary py-16 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="font-poppins font-semibold text-4xl md:text-5xl text-background leading-tight mb-4">
          Returns & Exchanges
        </h1>
        <p className="font-poppins text-sm text-background/70 max-w-[600px]">
          Not quite right? We're here to help. Start your return or exchange process below.
        </p>
      </div>

      <div className="w-full max-w-[700px] mx-auto px-6 py-16 flex flex-col items-center min-h-[500px]">
        
        {error && (
          <div className="w-full mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="font-poppins text-sm font-medium">{error}</span>
          </div>
        )}

        {step === "search" && (
          <div className="flex flex-col w-full animate-in fade-in duration-500">
            <h2 className="font-poppins font-medium text-2xl text-primary mb-6">Find Your Order</h2>
            <form onSubmit={handleSearch} className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-2 w-full">
                <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                  Order Number <span className="text-accent">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. LRL-12345"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full h-[54px] px-[20px] border border-stone-300 rounded-full bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-stone-400"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                  Email Address <span className="text-accent">*</span>
                </label>
                <input 
                  type="email"
                  placeholder="Enter the email used for the order"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[54px] px-[20px] border border-stone-300 rounded-full bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-stone-400"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={!orderNumber || !email || isLoading}
                className="w-full h-[54px] flex justify-center items-center gap-2 bg-primary hover:bg-stone-800 disabled:bg-stone-400 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest mt-4"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                {isLoading ? "Searching..." : "Find Order"}
              </button>
            </form>
          </div>
        )}

        {step === "select" && orderData && (
          <div className="flex flex-col w-full animate-in slide-in-from-right-8 fade-in duration-500">
            <button onClick={() => setStep("search")} className="flex items-center gap-2 text-stone-500 hover:text-primary mb-6 self-start transition-colors">
              <ArrowLeft size={16} />
              <span className="font-poppins text-sm">Back</span>
            </button>
            
            <h2 className="font-poppins font-medium text-2xl text-primary mb-2">Select Items to Return</h2>
            <p className="font-poppins text-sm text-stone-500 mb-6">Order #{orderData.orderNumber} • Ordered on {new Date(orderData.date).toLocaleDateString()}</p>
            
            <div className="flex flex-col gap-4 mb-8">
              {orderData.items.map((item: any) => {
                const isSelected = selectedItems.find(p => p.id === item.id);
                return (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-stone-200 rounded-2xl bg-white transition-colors">
                    <div className="flex items-center gap-4 w-full">
                      <input 
                        type="checkbox" 
                        checked={!!isSelected}
                        onChange={() => handleToggleItem(item.id, item.quantity)}
                        className="w-5 h-5 accent-[#1C1917] cursor-pointer shrink-0" 
                      />
                      <div className="relative w-16 h-20 bg-stone-100 rounded overflow-hidden shrink-0">
                        {item.variant.featuredImage ? (
                           <Image src={item.variant.featuredImage} alt={item.variant.product.name} fill className="object-cover" />
                        ) : (
                           <div className="w-full h-full flex justify-center items-center bg-stone-100"><Package className="text-stone-300"/></div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="font-poppins font-medium text-sm text-primary">{item.variant.product.name}</span>
                        <span className="font-poppins text-xs text-stone-500">{item.variant.name}</span>
                        <span className="font-poppins text-sm text-primary mt-1">Rs. {item.priceAtPurchase.toLocaleString()}</span>
                      </div>
                      {isSelected && (
                        <div className="flex flex-col items-center ml-auto border border-stone-200 rounded-lg overflow-hidden shrink-0">
                          <label className="text-[10px] uppercase font-poppins bg-stone-100 w-full text-center py-1 text-stone-500 border-b border-stone-200">Qty</label>
                          <select 
                            value={isSelected.quantity}
                            onChange={(e) => handleChangeQty(item.id, parseInt(e.target.value))}
                            className="bg-white px-3 py-1 font-poppins text-sm outline-none"
                          >
                            {Array.from({ length: item.quantity }).map((_, i) => (
                              <option key={i+1} value={i+1}>{i+1}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setStep("reason")}
              disabled={selectedItems.length === 0}
              className="w-full h-[54px] flex justify-center items-center gap-2 bg-primary hover:bg-stone-800 disabled:bg-stone-300 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest"
            >
              Continue
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === "reason" && orderData && (
          <div className="flex flex-col w-full animate-in slide-in-from-right-8 fade-in duration-500">
            <button onClick={() => setStep("select")} className="flex items-center gap-2 text-stone-500 hover:text-primary mb-6 self-start transition-colors">
              <ArrowLeft size={16} />
              <span className="font-poppins text-sm">Back</span>
            </button>
            
            <h2 className="font-poppins font-medium text-2xl text-primary mb-6">Reason for Return</h2>
            
            <div className="flex flex-col gap-8 w-full mb-8">
              {selectedItems.map(selected => {
                const itemDetails = orderData.items.find((i:any) => i.id === selected.id);
                return (
                  <div key={selected.id} className="flex flex-col gap-4 p-5 border border-stone-200 rounded-2xl bg-stone-50">
                    <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
                      <div className="relative w-12 h-16 bg-white rounded overflow-hidden shrink-0 border border-stone-100">
                         {itemDetails?.variant.featuredImage && <Image src={itemDetails.variant.featuredImage} alt="Img" fill className="object-cover" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-poppins font-medium text-sm text-primary">{itemDetails?.variant.product.name}</span>
                        <span className="font-poppins text-xs text-stone-500">Returning {selected.quantity} item(s)</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                        Why are you returning this? <span className="text-accent">*</span>
                      </label>
                      <select 
                        value={itemReasons[selected.id]?.reason || ""}
                        onChange={(e) => handleReasonChange(selected.id, 'reason', e.target.value)}
                        className="w-full h-[54px] px-[20px] border border-stone-300 rounded-xl bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select a reason</option>
                        <option value="size_too_small">Size is too small</option>
                        <option value="size_too_large">Size is too large</option>
                        <option value="quality">Quality issue</option>
                        <option value="changed_mind">Changed my mind</option>
                        <option value="wrong_item">Received wrong item</option>
                        <option value="damaged">Item was damaged</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                        Additional Details
                      </label>
                      <textarea 
                        rows={3}
                        value={itemReasons[selected.id]?.details || ""}
                        onChange={(e) => handleReasonChange(selected.id, 'details', e.target.value)}
                        placeholder="Please provide any additional information to help us process your return faster."
                        className="w-full p-4 border border-stone-300 rounded-xl bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none placeholder:text-stone-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={handleSubmitReturn}
              disabled={createReturnMutation.isPending}
              className="w-full h-[54px] flex justify-center items-center gap-2 bg-primary hover:bg-stone-800 disabled:bg-stone-400 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest"
            >
              {createReturnMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : null}
              {createReturnMutation.isPending ? "Submitting..." : "Submit Return Request"}
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center text-center w-full animate-in zoom-in-95 fade-in duration-500 pt-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
              <Package size={40} />
            </div>
            <h2 className="font-poppins font-semibold text-3xl text-primary mb-2">Request Submitted!</h2>
            <p className="font-poppins text-sm text-stone-500 max-w-[400px] mb-8">
              Your return request has been successfully submitted. Our team will review it and send instructions to your email within 24 hours.
            </p>
            <Link 
              href="/shop"
              className="w-full max-w-[300px] h-[54px] flex justify-center items-center bg-primary hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest"
            >
              Return to Shop
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
