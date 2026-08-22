"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Package, Truck, CheckCircle, Search, MapPin, XCircle } from "lucide-react";
import { useTrackOrder } from "@/hooks/useOrders";

export default function ClientContent() {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");

  const trackOrderMutation = useTrackOrder();

  const handleTrack = () => {
    setErrorMsg("");
    if (!orderNumber || orderNumber.trim() === "") {
      setErrorMsg("Order number is required");
      return;
    }
    if (!phoneNumber || phoneNumber.length < 9) {
      setErrorMsg("Valid phone number is required");
      return;
    }

    trackOrderMutation.mutate({ orderNumber, phone: phoneNumber }, {
      onError: (err: any) => {
        setErrorMsg(err?.response?.data?.error || "Order not found or details mismatch");
      }
    });
  };

  const order = trackOrderMutation.data;
  const isTracking = trackOrderMutation.isSuccess && !!order;
  const isLoading = trackOrderMutation.isPending;

  // Status Booleans
  const isCancelled = order?.status === 'CANCELLED';
  const isDelivered = order?.status === 'DELIVERED';
  const isShipped = order?.status === 'SHIPPED' || order?.status === 'DISPATCHED';
  const isProcessing = order?.status === 'PROCESSING' || isShipped || isDelivered;
  const isConfirmed = order?.status !== 'PENDING' && !isCancelled;

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-background pt-[83px]">
      
      {/* Top Section: Search */}
      <section className="flex flex-col items-center w-full px-4 md:px-[120px] py-[60px] md:py-[80px]">
        <div className="w-full max-w-[1040px] flex flex-col gap-[30px] md:gap-[40px]">
          
          <h1 className="font-poppins font-normal text-[36px] md:text-5xl text-primary leading-tight">
            Track Order
          </h1>

          <div className="w-full pb-[40px] border-b border-stone-300 flex flex-col gap-[24px]">
            <div className="flex flex-col md:flex-row gap-[24px]">
              
              {/* Order Number Input */}
              <div className="flex-1 flex flex-col gap-3">
                <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                  Order number <span className="text-accent">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. LC-10241"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full h-[52px] px-[20px] border border-stone-200 rounded-full bg-white font-poppins text-sm text-primary outline-none focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all"
                />
              </div>

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
                  className="h-[52px] px-8 md:w-[160px] flex justify-center items-center gap-2 bg-primary hover:bg-stone-800 disabled:bg-stone-400 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Search size={18} />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="text-red-500 font-poppins text-sm">
                {errorMsg}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Result Section (Only visible after searching) */}
      {isTracking && (
        <section className="flex flex-col lg:flex-row items-start w-full max-w-[1040px] px-4 md:px-[120px] lg:px-0 gap-16 lg:gap-[80px] pb-[100px] animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Left Column: Timeline */}
          <div className="flex flex-col flex-1 w-full gap-[40px]">
            <h2 className="font-poppins font-medium text-2xl md:text-4xl text-primary leading-tight">
              Order Status: <span className={isCancelled ? "text-red-500" : "text-emerald-600"}>{order.status}</span>
            </h2>

            {/* Minimalist Timeline */}
            {!isCancelled && (
              <div className="flex flex-row items-center w-full justify-between relative mt-4">
                {/* Connecting Line (Background) */}
                <div className="absolute top-[24px] left-[10%] right-[10%] h-[2px] bg-stone-200 z-0"></div>
                {/* Connecting Line (Active Progress) */}
                <div 
                  className="absolute top-[24px] left-[10%] h-[2px] bg-primary z-0 transition-all duration-1000"
                  style={{
                    width: isDelivered ? '80%' : isShipped ? '50%' : isProcessing ? '20%' : '0%'
                  }}
                ></div>

                {/* Step 1: Order Accepted */}
                <div className="flex flex-col items-center gap-4 z-10 w-[100px]">
                  <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-md ${isConfirmed ? 'bg-primary text-white' : 'border-2 border-primary bg-white text-primary'}`}>
                    <CheckCircle size={22} />
                  </div>
                  <span className="font-poppins font-medium text-xs text-primary text-center leading-snug">Order<br/>Accepted</span>
                </div>

                {/* Step 2: Processing */}
                <div className="flex flex-col items-center gap-4 z-10 w-[100px]">
                  <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center ${isProcessing ? (isShipped ? 'bg-primary text-white shadow-md' : 'border-2 border-primary bg-white text-primary shadow-sm') : 'border border-stone-200 bg-white text-stone-300'}`}>
                    <Package size={22} />
                  </div>
                  <span className={`font-poppins font-medium text-xs text-center leading-snug ${isProcessing ? 'text-primary' : 'text-stone-400 font-light'}`}>Processing</span>
                </div>

                {/* Step 3: Shipped */}
                <div className="flex flex-col items-center gap-4 z-10 w-[100px]">
                  <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center ${isShipped ? (isDelivered ? 'bg-primary text-white shadow-md' : 'border-2 border-primary bg-white text-primary shadow-sm') : 'border border-stone-200 bg-white text-stone-300'}`}>
                    <Truck size={22} />
                  </div>
                  <span className={`font-poppins font-medium text-xs text-center leading-snug ${isShipped ? 'text-primary' : 'text-stone-400 font-light'}`}>Shipped</span>
                </div>

                {/* Step 4: Delivered */}
                <div className="flex flex-col items-center gap-4 z-10 w-[100px]">
                  <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center ${isDelivered ? 'bg-primary text-white shadow-md' : 'border border-stone-200 bg-white text-stone-300'}`}>
                    <MapPin size={22} />
                  </div>
                  <span className={`font-poppins font-medium text-xs text-center leading-snug ${isDelivered ? 'text-primary' : 'text-stone-400 font-light'}`}>Delivered</span>
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="flex items-center gap-4 text-red-500">
                <XCircle size={32} />
                <span className="font-poppins text-lg">This order was cancelled.</span>
              </div>
            )}

            {order.trackingNumber && (
              <div className="mt-8 p-6 bg-stone-50 rounded-xl border border-stone-200">
                <p className="font-poppins text-sm text-stone-500 mb-2">Courier Tracking</p>
                <div className="flex items-center justify-between">
                  <span className="font-poppins font-medium text-lg text-primary">{order.trackingNumber}</span>
                  {/* Mock track button, realistically goes to courier site */}
                  <a href="#" className="font-poppins text-sm text-blue-600 hover:underline">Track on Fardar</a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Details Summary */}
          <div className="flex flex-col w-full lg:w-[420px] gap-[30px] pt-[10px]">
            <h3 className="font-poppins font-medium text-xl text-primary">
              Order Details
            </h3>

            {/* Cart Items List */}
            <div className="flex flex-col w-full gap-4 max-h-[300px] overflow-y-auto pr-2">
              {order.items.map((item: any) => {
                const variantName = item.variant?.name || '';
                const productName = item.variant?.product?.name || 'Unknown Product';
                let imageUrl = '';
                if (item.variant?.featuredImage) imageUrl = item.variant.featuredImage;
                else if (item.variant?.product?.variants?.[0]?.featuredImage) imageUrl = item.variant.product.variants[0].featuredImage;

                return (
                  <div key={item.id} className="flex flex-row items-center w-full p-4 bg-white border border-stone-200 rounded-lg shadow-sm gap-4 relative">
                    <div className="w-[80px] h-[80px] relative bg-stone-100 rounded-md overflow-hidden shrink-0">
                      {imageUrl && <Image src={imageUrl} alt={productName} fill className="object-cover object-top" />}
                    </div>
                    <div className="flex flex-col flex-1 justify-center gap-1">
                      <h4 className="font-poppins font-medium text-sm text-primary leading-tight pr-6">
                        {productName}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="font-poppins text-xs text-stone-500">{variantName}</span>
                        <span className="font-poppins font-medium text-xs text-primary">{item.quantity} × Rs. {item.priceAtPurchase.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Breakdown */}
            <div className="flex flex-col w-full gap-4 border-t border-stone-200 pt-6">
              <div className="flex justify-between items-center w-full">
                <span className="font-poppins text-sm text-stone-500">Subtotal</span>
                <span className="font-poppins font-medium text-sm text-primary">Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center w-full">
                <span className="font-poppins text-sm text-stone-500">Shipping</span>
                <span className="font-poppins font-medium text-sm text-primary">Rs. {order.shippingFee.toLocaleString()}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between items-center w-full">
                  <span className="font-poppins text-sm text-stone-500">Tax</span>
                  <span className="font-poppins font-medium text-sm text-primary">Rs. {order.tax.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center w-full mt-2 pt-4 border-t border-stone-200">
                <span className="font-poppins font-semibold text-base text-primary">Total</span>
                <span className="font-poppins font-semibold text-lg text-primary">Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>

          </div>
        </section>
      )}

    </main>
  );
}
