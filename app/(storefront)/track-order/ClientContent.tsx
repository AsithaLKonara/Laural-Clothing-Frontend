"use client";

import React, { useState } from "react";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Package, Truck, CheckCircle, Search, MapPin } from "lucide-react";
import { useTrackOrderByPhone } from "@/hooks/useOrders";

// Helper component for each order's timeline
function OrderTrackingCard({ order }: { order: any }) {
  let currentStep = 0;
  
  if (order.status === 'PENDING' || order.status === 'PAID') currentStep = 1;
  if (order.status === 'PROCESSING') currentStep = 2;
  if (order.status === 'DISPATCHED') currentStep = 3;
  if (order.status === 'DELIVERED') currentStep = 4;

  if (order.trackingInfo) {
    const ts = order.trackingInfo.status;
    if (ts === 'DELIVERED') currentStep = 4;
    else currentStep = 3; 
  }

  return (
    <div className="flex flex-col lg:flex-row items-start w-full gap-8 lg:gap-[80px] p-6 bg-white border border-stone-200 rounded-2xl shadow-sm">
      {/* Left Column: Timeline */}
      <div className="flex flex-col flex-1 w-full gap-[40px]">
        <h2 className="font-poppins font-medium text-2xl md:text-3xl text-primary leading-tight">
          {order.trackingInfo 
            ? `Status: ${order.trackingInfo.status.replace(/_/g, ' ')}` 
            : `Order ${order.orderNumber}`}
        </h2>
        
        {order.trackingInfo && (
          <p className="font-poppins text-sm text-stone-500">
            Last updated location: {order.trackingInfo.location}
          </p>
        )}

        {/* Minimalist Timeline */}
        <div className="flex flex-row items-center w-full justify-between relative mt-4">
          <div className="absolute top-[24px] left-[10%] right-[10%] h-[2px] bg-stone-200 z-0"></div>
          <div 
            className="absolute top-[24px] left-[10%] h-[2px] bg-primary z-0 transition-all duration-1000"
            style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '30%' : currentStep === 3 ? '60%' : currentStep === 4 ? '80%' : '0%' }}
          ></div>

          {/* Step 1: Order Accepted */}
          <div className="flex flex-col items-center gap-4 z-10 w-[100px]">
            <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-sm transition-colors duration-500
              ${currentStep >= 1 ? 'bg-primary text-white border-none' : 'border-2 border-stone-200 bg-white text-stone-300'}
            `}>
              <CheckCircle size={22} />
            </div>
            <span className={`font-poppins font-medium text-xs text-center leading-snug ${currentStep >= 1 ? 'text-primary' : 'text-stone-400'}`}>Order<br/>Accepted</span>
          </div>

          {/* Step 2: Processing */}
          <div className="flex flex-col items-center gap-4 z-10 w-[100px]">
            <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-sm transition-colors duration-500
              ${currentStep >= 2 ? 'border-2 border-primary bg-white text-primary' : 'border-2 border-stone-200 bg-white text-stone-300'}
            `}>
              <Package size={22} />
            </div>
            <span className={`font-poppins font-medium text-xs text-center leading-snug ${currentStep >= 2 ? 'text-primary' : 'text-stone-400'}`}>Processing</span>
          </div>

          {/* Step 3: Shipped */}
          <div className="flex flex-col items-center gap-4 z-10 w-[100px]">
            <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-sm transition-colors duration-500
              ${currentStep >= 3 ? 'bg-primary text-white border-none' : 'border-2 border-stone-200 bg-white text-stone-300'}
            `}>
              <Truck size={22} />
            </div>
            <span className={`font-poppins font-medium text-xs text-center leading-snug ${currentStep >= 3 ? 'text-primary' : 'text-stone-400'}`}>Shipped</span>
          </div>

          {/* Step 4: Delivered */}
          <div className="flex flex-col items-center gap-4 z-10 w-[100px]">
            <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-sm transition-colors duration-500
              ${currentStep >= 4 ? 'bg-primary text-white border-none' : 'border-2 border-stone-200 bg-white text-stone-300'}
            `}>
              <MapPin size={22} />
            </div>
            <span className={`font-poppins font-medium text-xs text-center leading-snug ${currentStep >= 4 ? 'text-primary' : 'text-stone-400'}`}>Delivered</span>
          </div>
        </div>
      </div>

      {/* Right Column: Order Details Summary */}
      <div className="flex flex-col w-full lg:w-[420px] gap-[20px]">
        <h3 className="font-poppins font-medium text-lg text-primary border-b border-stone-100 pb-2">
          Order Details
        </h3>

        <div className="flex flex-col w-full gap-3 max-h-[300px] overflow-y-auto pr-2">
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex flex-row items-center w-full p-3 bg-stone-50 border border-stone-100 rounded-lg gap-4">
              <div className="w-[50px] h-[50px] relative bg-stone-200 rounded-md overflow-hidden shrink-0">
                {item.variant?.product?.images?.[0] ? (
                  <Image src={item.variant.product.images[0]} alt={item.variant.product.name} fill sizes="100px" className="object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <Package size={16} />
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-1 justify-center">
                <h4 className="font-poppins font-medium text-sm text-primary leading-tight line-clamp-1">
                  {item.variant?.product?.name || 'Unknown Item'}
                </h4>
                <span className="font-poppins font-light text-xs text-stone-500 uppercase mt-1">
                  Qty: {item.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full pt-4 border-t border-stone-200 flex justify-between items-center">
          <span className="font-poppins font-medium text-sm text-stone-500">Order Total</span>
          <span className="font-poppins font-semibold text-lg text-primary">Rs. {order.total?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ClientContent() {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [searchPhone, setSearchPhone] = useState<string | undefined>();

  const { data: ordersData, isLoading, isError } = useTrackOrderByPhone(searchPhone);

  const handleTrack = () => {
    if (phoneNumber && phoneNumber.length > 5) {
      setSearchPhone(phoneNumber);
    }
  };

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-background pt-[83px]">
      
      {/* Top Section: Search */}
      <section className="flex flex-col items-center w-full px-4 md:px-[120px] py-[60px] md:py-[80px]">
        <div className="w-full max-w-[1040px] flex flex-col gap-[30px] md:gap-[40px]">
          
          <h1 className="font-poppins font-normal text-[36px] md:text-5xl text-primary leading-tight">
            Track Your Orders
          </h1>

          <div className="w-full pb-[40px] border-b border-stone-300 flex flex-col md:flex-row gap-[24px]">
            {/* Phone Number Input */}
            <div className="flex-1 flex flex-col gap-3">
              <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                Phone number <span className="text-accent">*</span>
              </label>
              
              <PhoneInput 
                placeholder="Enter phone number to track"
                value={phoneNumber}
                onChange={setPhoneNumber}
                defaultCountry="LK"
                className="w-full h-[52px] px-[20px] border border-stone-200 rounded-full bg-white font-poppins text-sm text-primary outline-none focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all"
                numberInputProps={{
                  className: "w-full h-full bg-transparent border-none outline-none text-primary font-poppins text-sm placeholder:text-stone-400 pl-4",
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
                disabled={isLoading}
                className="h-[52px] px-8 md:w-[160px] flex justify-center items-center gap-2 bg-primary hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Search size={18} />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Result Section (Only visible after searching) */}
      {searchPhone && (
        <section className="flex flex-col items-center w-full max-w-[1040px] px-4 md:px-[120px] lg:px-0 gap-8 pb-[100px] animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {isError ? (
            <div className="w-full p-6 bg-red-50 text-red-600 rounded-lg border border-red-200 text-center font-poppins">
              No active orders found for this phone number. Please check the number and try again.
            </div>
          ) : Array.isArray(ordersData) && ordersData.length > 0 ? (
            <div className="flex flex-col w-full gap-8">
              <h2 className="font-poppins text-stone-500 font-medium">Found {ordersData.length} active order(s)</h2>
              {ordersData.map((order: any) => (
                <OrderTrackingCard key={order.id} order={order} />
              ))}
            </div>
          ) : !isLoading ? (
             <div className="w-full p-6 bg-stone-50 text-stone-600 rounded-lg border border-stone-200 text-center font-poppins">
              No active orders found for this phone number.
            </div>
          ) : null}
        </section>
      )}
    </main>
  );
}
