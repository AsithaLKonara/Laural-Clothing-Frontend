"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Package, Truck, CheckCircle, Clock, Search, X, MapPin } from "lucide-react";

export default function TrackOrderPage() {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = () => {
    if (phoneNumber && phoneNumber.length > 5) {
      setIsTracking(true);
    }
  };

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-[#FAFAF9] pt-[83px]">
      
      {/* Top Section: Search */}
      <section className="flex flex-col items-center w-full px-4 md:px-[120px] py-[60px] md:py-[80px]">
        <div className="w-full max-w-[1040px] flex flex-col gap-[30px] md:gap-[40px]">
          
          <h1 className="font-poppins font-normal text-[36px] md:text-[48px] text-[#1C1917] leading-tight">
            Track Order
          </h1>

          <div className="w-full pb-[40px] border-b border-stone-300 flex flex-col md:flex-row gap-[24px]">
            {/* Phone Number Input */}
            <div className="flex-1 flex flex-col gap-3">
              <label className="font-poppins font-medium text-[13px] uppercase tracking-wider text-stone-500">
                Phone number <span className="text-[#C19A5B]">*</span>
              </label>
              
              <PhoneInput 
                placeholder="Enter phone number to track"
                value={phoneNumber}
                onChange={setPhoneNumber}
                defaultCountry="LK"
                className="w-full h-[52px] px-[20px] border border-stone-200 rounded-full bg-white font-poppins text-[15px] text-[#1C1917] outline-none focus-within:border-[#C19A5B] focus-within:ring-1 focus-within:ring-[#C19A5B] transition-all"
                numberInputProps={{
                  className: "w-full h-full bg-transparent border-none outline-none text-[#1C1917] font-poppins text-[15px] placeholder:text-stone-400 pl-4",
                }}
              />
              <style jsx global>{`
                .PhoneInputCountry {
                  border-right: 1px solid #e7e5e4;
                  padding-right: 12px;
                  margin-right: 0;
                }
                .PhoneInputCountryIcon {
                  width: 24px;
                  height: 16px;
                  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                  border: none;
                }
                .PhoneInputCountrySelectArrow {
                  color: #a8a29e;
                  opacity: 1;
                }
              `}</style>
            </div>

            {/* Search Button */}
            <div className="flex flex-col gap-3 justify-end">
              <button 
                onClick={handleTrack}
                className="h-[52px] px-8 md:w-[160px] flex justify-center items-center gap-2 bg-[#1C1917] hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-[14px] text-white uppercase tracking-widest"
              >
                <Search size={18} />
                Search
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Result Section (Only visible after searching) */}
      {isTracking && (
        <section className="flex flex-col lg:flex-row items-start w-full max-w-[1040px] px-4 md:px-[120px] lg:px-0 gap-16 lg:gap-[80px] pb-[100px] animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Left Column: Timeline */}
          <div className="flex flex-col flex-1 w-full gap-[40px]">
            <h2 className="font-poppins font-medium text-[24px] md:text-[32px] text-[#1C1917] leading-tight">
              Arrives at 25th Aug 2026
            </h2>

            {/* Minimalist Timeline */}
            <div className="flex flex-row items-center w-full justify-between relative mt-4">
              {/* Connecting Line (Background) */}
              <div className="absolute top-[24px] left-[10%] right-[10%] h-[2px] bg-stone-200 z-0"></div>
              {/* Connecting Line (Active Progress) */}
              <div className="absolute top-[24px] left-[10%] right-[50%] h-[2px] bg-[#1C1917] z-0"></div>

              {/* Step 1: Order Accepted (Completed) */}
              <div className="flex flex-col items-center gap-4 z-10 w-[100px]">
                <div className="w-[50px] h-[50px] rounded-full bg-[#1C1917] text-white flex items-center justify-center shadow-md">
                  <CheckCircle size={22} />
                </div>
                <span className="font-poppins font-medium text-[13px] text-[#1C1917] text-center leading-snug">Order<br/>Accepted</span>
              </div>

              {/* Step 2: Processing (Active) */}
              <div className="flex flex-col items-center gap-4 z-10 w-[100px]">
                <div className="w-[50px] h-[50px] rounded-full border-2 border-[#1C1917] bg-white text-[#1C1917] flex items-center justify-center shadow-sm">
                  <Package size={22} />
                </div>
                <span className="font-poppins font-medium text-[13px] text-[#1C1917] text-center leading-snug">Processing</span>
              </div>

              {/* Step 3: Shipped (Pending) */}
              <div className="flex flex-col items-center gap-4 z-10 w-[100px]">
                <div className="w-[50px] h-[50px] rounded-full border border-stone-200 bg-white text-stone-300 flex items-center justify-center">
                  <Truck size={22} />
                </div>
                <span className="font-poppins font-light text-[13px] text-stone-400 text-center leading-snug">Shipped</span>
              </div>

              {/* Step 4: Delivered (Pending) */}
              <div className="flex flex-col items-center gap-4 z-10 w-[100px]">
                <div className="w-[50px] h-[50px] rounded-full border border-stone-200 bg-white text-stone-300 flex items-center justify-center">
                  <MapPin size={22} />
                </div>
                <span className="font-poppins font-light text-[13px] text-stone-400 text-center leading-snug">Delivered</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Details Summary */}
          <div className="flex flex-col w-full lg:w-[420px] gap-[30px] pt-[10px]">
            <h3 className="font-poppins font-medium text-[20px] text-[#1C1917]">
              Order Details
            </h3>

            {/* Cart Items List */}
            <div className="flex flex-col w-full gap-4">
              {/* Mock Cart Item */}
              <div className="flex flex-row items-center w-full p-4 bg-white border border-stone-200 rounded-lg shadow-sm gap-4 relative">
                <div className="w-[80px] h-[80px] relative bg-stone-100 rounded-md overflow-hidden shrink-0">
                  <Image src="/DSC06483-640x800.jpg" alt="Vesper Long Sleeve Top" fill className="object-cover object-top" />
                </div>
                <div className="flex flex-col flex-1 justify-center gap-1">
                  <h4 className="font-poppins font-medium text-[14px] text-[#1C1917] leading-tight pr-6">
                    Vesper Long Sleeve Top – Pink
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="font-poppins text-[12px] text-stone-500">UK : 08</span>
                    <span className="font-poppins font-medium text-[12px] text-[#1C1917]">1 × Rs: 2190.00</span>
                  </div>
                </div>
                {/* Normally a close button goes here in a cart, but in an order summary it's just static. 
                    I'll add a view product link icon instead. */}
                <Link href="/product/vesper-long-sleeve-top" className="absolute top-4 right-4 text-stone-400 hover:text-[#1C1917] transition-colors">
                  <Search size={16} />
                </Link>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="flex flex-col w-full gap-4 border-t border-stone-200 pt-6">
              <div className="flex justify-between items-center w-full">
                <span className="font-poppins text-[14px] text-stone-500">Subtotal</span>
                <span className="font-poppins font-medium text-[14px] text-[#1C1917]">Rs. 45.00</span>
              </div>
              <div className="flex justify-between items-center w-full">
                <span className="font-poppins text-[14px] text-stone-500">Shipping</span>
                <span className="font-poppins font-medium text-[14px] text-[#1C1917]">Rs. 5.00</span>
              </div>
              <div className="flex justify-between items-center w-full">
                <span className="font-poppins text-[14px] text-stone-500">Discount</span>
                <span className="font-poppins font-medium text-[14px] text-[#1C1917]">-Rs. 10.00</span>
              </div>
              
              <div className="flex justify-between items-center w-full mt-2 pt-4 border-t border-stone-200">
                <span className="font-poppins font-semibold text-[16px] text-[#1C1917]">Total</span>
                <span className="font-poppins font-semibold text-[18px] text-[#1C1917]">Rs. 40.00</span>
              </div>
            </div>

          </div>
        </section>
      )}

    </main>
  );
}
