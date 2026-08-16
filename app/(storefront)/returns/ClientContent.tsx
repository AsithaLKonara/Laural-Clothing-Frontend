
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Package, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function ClientContent() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"search" | "select" | "reason" | "success">("search");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber && email) {
      setStep("select");
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
                disabled={!orderNumber || !email}
                className="w-full h-[54px] flex justify-center items-center gap-2 bg-primary hover:bg-stone-800 disabled:bg-stone-300 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest mt-4"
              >
                <Search size={18} />
                Find Order
              </button>
            </form>
          </div>
        )}

        {step === "select" && (
          <div className="flex flex-col w-full animate-in slide-in-from-right-8 fade-in duration-500">
            <button onClick={() => setStep("search")} className="flex items-center gap-2 text-stone-500 hover:text-primary mb-6 self-start transition-colors">
              <ArrowLeft size={16} />
              <span className="font-poppins text-sm">Back</span>
            </button>
            
            <h2 className="font-poppins font-medium text-2xl text-primary mb-2">Select Items to Return</h2>
            <p className="font-poppins text-sm text-stone-500 mb-6">Order #LRL-89234 • Delivered on Aug 13, 2026</p>
            
            <div className="flex flex-col gap-4 mb-8">
              {/* Item 1 */}
              <div className="flex items-center gap-4 p-4 border border-stone-200 rounded-2xl bg-white hover:border-stone-400 cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 accent-[#1C1917] cursor-pointer" />
                <div className="relative w-16 h-20 bg-stone-100 rounded overflow-hidden shrink-0">
                  <Image src="/products/product_1.jpg" alt="Vesper Long Sleeve Top" fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-poppins font-medium text-sm text-primary">Vesper Long Sleeve Top</span>
                  <span className="font-poppins text-xs text-stone-500">Color: Stone • Size: M</span>
                  <span className="font-poppins text-sm text-primary mt-1">Rs. 5,190.00</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep("reason")}
              className="w-full h-[54px] flex justify-center items-center gap-2 bg-primary hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest"
            >
              Continue
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === "reason" && (
          <div className="flex flex-col w-full animate-in slide-in-from-right-8 fade-in duration-500">
            <button onClick={() => setStep("select")} className="flex items-center gap-2 text-stone-500 hover:text-primary mb-6 self-start transition-colors">
              <ArrowLeft size={16} />
              <span className="font-poppins text-sm">Back</span>
            </button>
            
            <h2 className="font-poppins font-medium text-2xl text-primary mb-6">Reason for Return</h2>
            
            <div className="flex flex-col gap-6 w-full mb-8">
              <div className="flex flex-col gap-2 w-full">
                <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                  Why are you returning this? <span className="text-accent">*</span>
                </label>
                <select className="w-full h-[54px] px-[20px] border border-stone-300 rounded-full bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none cursor-pointer">
                  <option value="">Select a reason</option>
                  <option value="size_too_small">Size is too small</option>
                  <option value="size_too_large">Size is too large</option>
                  <option value="quality">Quality issue</option>
                  <option value="changed_mind">Changed my mind</option>
                  <option value="wrong_item">Received wrong item</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                  Additional Details
                </label>
                <textarea 
                  rows={4}
                  placeholder="Please provide any additional information to help us process your return faster."
                  className="w-full p-4 border border-stone-300 rounded-2xl bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none placeholder:text-stone-400"
                />
              </div>
            </div>

            <button 
              onClick={() => setStep("success")}
              className="w-full h-[54px] flex justify-center items-center gap-2 bg-primary hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest"
            >
              Submit Return Request
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
