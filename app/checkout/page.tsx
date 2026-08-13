"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TicketPercent, CreditCard, Banknote, ShieldCheck } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type PaymentMethod = "cod" | "mintpay" | "koko" | "payzy" | "onepay";

export default function CheckoutPage() {
  const [shippingPhone, setShippingPhone] = useState<string | undefined>();
  const [billingPhone, setBillingPhone] = useState<string | undefined>();
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [discountCode, setDiscountCode] = useState("");

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Proceed to payment gateway or success page
  };

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-[#FAFAF9] pt-[83px]">
      <div className="flex flex-col lg:flex-row w-full max-w-[1280px] mx-auto py-[60px] px-4 md:px-[80px] lg:px-[120px] gap-12 lg:gap-[60px]">
        
        {/* Left Column: Forms */}
        <div className="flex flex-col flex-1 w-full lg:pr-[60px] lg:border-r lg:border-stone-200 gap-10">
          <div className="flex flex-col gap-2">
            <h1 className="font-poppins font-medium text-[32px] md:text-[40px] text-[#1C1917] leading-tight">
              Checkout
            </h1>
          </div>

          <form onSubmit={handlePlaceOrder} className="flex flex-col gap-10 w-full">
            
            {/* Shipping Information */}
            <div className="flex flex-col gap-6 w-full">
              <h2 className="font-poppins font-medium text-[20px] text-[#1C1917]">
                Shipping Information
              </h2>
              
              <div className="flex flex-col gap-5 w-full">
                {/* Full Name */}
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-poppins font-medium text-[13px] uppercase tracking-wider text-stone-500">
                    Full name <span className="text-[#C19A5B]">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter full name"
                    className="w-full h-[52px] px-[20px] border border-stone-200 rounded-full bg-white font-poppins text-[15px] text-[#1C1917] outline-none focus:border-[#C19A5B] focus:ring-1 focus:ring-[#C19A5B] transition-all placeholder:text-stone-400"
                    required
                  />
                </div>

                {/* Address Lines */}
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-poppins font-medium text-[13px] uppercase tracking-wider text-stone-500">
                    Address <span className="text-[#C19A5B]">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Address Line 1"
                    className="w-full h-[52px] px-[20px] border border-stone-200 rounded-full bg-white font-poppins text-[15px] text-[#1C1917] outline-none focus:border-[#C19A5B] focus:ring-1 focus:ring-[#C19A5B] transition-all placeholder:text-stone-400 mb-2"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Address Line 2 (Optional)"
                    className="w-full h-[52px] px-[20px] border border-stone-200 rounded-full bg-white font-poppins text-[15px] text-[#1C1917] outline-none focus:border-[#C19A5B] focus:ring-1 focus:ring-[#C19A5B] transition-all placeholder:text-stone-400"
                  />
                </div>

                {/* City */}
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-poppins font-medium text-[13px] uppercase tracking-wider text-stone-500">
                    City <span className="text-[#C19A5B]">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter city"
                    className="w-full h-[52px] px-[20px] border border-stone-200 rounded-full bg-white font-poppins text-[15px] text-[#1C1917] outline-none focus:border-[#C19A5B] focus:ring-1 focus:ring-[#C19A5B] transition-all placeholder:text-stone-400"
                    required
                  />
                </div>

                {/* Phone & Email (Row on Desktop) */}
                <div className="flex flex-col md:flex-row gap-5 w-full">
                  {/* Phone */}
                  <div className="flex flex-col gap-2 w-full flex-1">
                    <label className="font-poppins font-medium text-[13px] uppercase tracking-wider text-stone-500">
                      Phone number <span className="text-[#C19A5B]">*</span>
                    </label>
                    <PhoneInput 
                      placeholder="Enter phone number"
                      value={shippingPhone}
                      onChange={setShippingPhone}
                      defaultCountry="LK"
                      className="w-full h-[52px] px-[20px] border border-stone-200 rounded-full bg-white font-poppins text-[15px] text-[#1C1917] outline-none focus-within:border-[#C19A5B] focus-within:ring-1 focus-within:ring-[#C19A5B] transition-all"
                      numberInputProps={{
                        className: "w-full h-full bg-transparent border-none outline-none text-[#1C1917] font-poppins text-[15px] placeholder:text-stone-400 pl-4",
                        required: true
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2 w-full flex-1">
                    <label className="font-poppins font-medium text-[13px] uppercase tracking-wider text-stone-500">
                      Email address <span className="text-[#C19A5B]">*</span>
                    </label>
                    <input 
                      type="email" 
                      placeholder="Enter email address"
                      className="w-full h-[52px] px-[20px] border border-stone-200 rounded-full bg-white font-poppins text-[15px] text-[#1C1917] outline-none focus:border-[#C19A5B] focus:ring-1 focus:ring-[#C19A5B] transition-all placeholder:text-stone-400"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Checkbox for T&C */}
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="terms" 
                className="w-5 h-5 accent-[#1C1917] rounded-sm cursor-pointer"
                required
              />
              <label htmlFor="terms" className="font-poppins text-[14px] text-[#1C1917] cursor-pointer select-none mt-1">
                I have read and agree to the Terms and Conditions.
              </label>
            </div>

            {/* Billing Address Toggle */}
            <div className="flex flex-col gap-4 w-full">
              <h2 className="font-poppins font-medium text-[20px] text-[#1C1917]">
                Billing Address <span className="text-[#C19A5B]">*</span>
              </h2>
              <div className="flex flex-col border border-stone-200 rounded-[24px] overflow-hidden bg-white shadow-sm">
                
                {/* Same as Shipping */}
                <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-stone-50 transition-colors border-b border-stone-200">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${billingSameAsShipping ? 'border-[#1C1917] bg-[#1C1917]' : 'border-stone-300 bg-white'}`}>
                    {billingSameAsShipping && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <input 
                    type="radio" 
                    name="billingToggle" 
                    checked={billingSameAsShipping} 
                    onChange={() => setBillingSameAsShipping(true)} 
                    className="hidden" 
                  />
                  <span className="font-poppins text-[15px] text-[#1C1917] font-medium">Same as shipping address</span>
                </label>

                {/* Different Billing */}
                <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${!billingSameAsShipping ? 'border-[#1C1917] bg-[#1C1917]' : 'border-stone-300 bg-white'}`}>
                    {!billingSameAsShipping && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <input 
                    type="radio" 
                    name="billingToggle" 
                    checked={!billingSameAsShipping} 
                    onChange={() => setBillingSameAsShipping(false)} 
                    className="hidden" 
                  />
                  <span className="font-poppins text-[15px] text-[#1C1917] font-medium">Use a different billing address</span>
                </label>

              </div>
            </div>

            {/* If different billing, show partial form */}
            {!billingSameAsShipping && (
              <div className="flex flex-col gap-5 w-full animate-in fade-in slide-in-from-top-4 duration-300 bg-white p-6 rounded-[24px] border border-stone-200 shadow-sm">
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-poppins font-medium text-[13px] uppercase tracking-wider text-stone-500">
                    Billing Address <span className="text-[#C19A5B]">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Address Line 1"
                    className="w-full h-[52px] px-[20px] border border-stone-200 rounded-full bg-white font-poppins text-[15px] text-[#1C1917] outline-none focus:border-[#C19A5B] focus:ring-1 focus:ring-[#C19A5B] transition-all placeholder:text-stone-400"
                    required
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-5 w-full">
                  <div className="flex flex-col gap-2 w-full flex-1">
                    <label className="font-poppins font-medium text-[13px] uppercase tracking-wider text-stone-500">
                      City <span className="text-[#C19A5B]">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter city"
                      className="w-full h-[52px] px-[20px] border border-stone-200 rounded-full bg-white font-poppins text-[15px] text-[#1C1917] outline-none focus:border-[#C19A5B] focus:ring-1 focus:ring-[#C19A5B] transition-all placeholder:text-stone-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full flex-1">
                    <label className="font-poppins font-medium text-[13px] uppercase tracking-wider text-stone-500">
                      Phone <span className="text-[#C19A5B]">*</span>
                    </label>
                    <PhoneInput 
                      placeholder="Enter phone number"
                      value={billingPhone}
                      onChange={setBillingPhone}
                      defaultCountry="LK"
                      className="w-full h-[52px] px-[20px] border border-stone-200 rounded-full bg-white font-poppins text-[15px] text-[#1C1917] outline-none focus-within:border-[#C19A5B] focus-within:ring-1 focus-within:ring-[#C19A5B] transition-all"
                      numberInputProps={{
                        className: "w-full h-full bg-transparent border-none outline-none text-[#1C1917] font-poppins text-[15px] placeholder:text-stone-400 pl-4",
                        required: true
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Place Order Button (Shows above cart on mobile) */}
            <div className="flex lg:hidden w-full pt-4">
               <button 
                type="submit"
                className="w-full h-[54px] flex justify-center items-center bg-[#1C1917] hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-[14px] text-white uppercase tracking-widest"
              >
                Place Order
              </button>
            </div>
            
          </form>
        </div>

        {/* Right Column: Order Summary & Payment */}
        <div className="flex flex-col w-full lg:w-[420px] gap-8">
          
          <h2 className="font-poppins font-medium text-[20px] text-[#1C1917]">
            Review your cart
          </h2>

          {/* Cart Items */}
          <div className="flex flex-col w-full gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {/* Mock Cart Item 1 */}
            <div className="flex flex-row items-center w-full p-3 bg-white border border-stone-200 rounded-xl shadow-sm gap-4">
              <div className="w-[70px] h-[70px] relative bg-stone-100 rounded-lg overflow-hidden shrink-0">
                <Image src="/DSC06483-640x800.jpg" alt="Vesper Long Sleeve Top" fill className="object-cover object-top" />
              </div>
              <div className="flex flex-col flex-1 justify-center gap-1">
                <h4 className="font-poppins font-medium text-[13px] text-[#1C1917] leading-tight">
                  Vesper Long Sleeve Top – Pink
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-poppins text-[12px] text-stone-500">UK : 08</span>
                  <span className="font-poppins font-medium text-[12px] text-[#1C1917]">1 × Rs: 2190.00</span>
                </div>
              </div>
            </div>

            {/* Mock Cart Item 2 */}
            <div className="flex flex-row items-center w-full p-3 bg-white border border-stone-200 rounded-xl shadow-sm gap-4">
              <div className="w-[70px] h-[70px] relative bg-stone-100 rounded-lg overflow-hidden shrink-0">
                <Image src="/DSC03204-scaled.jpg" alt="Basic White Tee" fill className="object-cover object-top" />
              </div>
              <div className="flex flex-col flex-1 justify-center gap-1">
                <h4 className="font-poppins font-medium text-[13px] text-[#1C1917] leading-tight">
                  Basic White Tee
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-poppins text-[12px] text-stone-500">UK : 10</span>
                  <span className="font-poppins font-medium text-[12px] text-[#1C1917]">2 × Rs: 1500.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Discount Code */}
          <div className="flex items-center w-full p-1 bg-white border border-stone-200 rounded-full shadow-sm">
            <div className="pl-4 text-stone-400">
              <TicketPercent size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Discount code" 
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="flex-1 h-[44px] bg-transparent border-none outline-none px-3 font-poppins text-[14px] text-[#1C1917] placeholder:text-stone-400"
            />
            <button className="h-[44px] px-6 bg-stone-100 hover:bg-stone-200 transition-colors rounded-full font-poppins font-medium text-[13px] text-[#1C1917]">
              Apply
            </button>
          </div>

          {/* Order Totals */}
          <div className="flex flex-col w-full gap-3 py-6 border-y border-stone-200">
            <div className="flex justify-between items-center w-full">
              <span className="font-poppins text-[14px] text-stone-500">Subtotal</span>
              <span className="font-poppins font-medium text-[14px] text-[#1C1917]">Rs. 5190.00</span>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="font-poppins text-[14px] text-stone-500">Shipping</span>
              <span className="font-poppins font-medium text-[14px] text-[#1C1917]">Rs. 350.00</span>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="font-poppins text-[14px] text-stone-500">Loyalty Points</span>
              <span className="font-poppins font-medium text-[14px] text-emerald-600">-Rs. 100.00</span>
            </div>
            <div className="flex justify-between items-center w-full mt-2 pt-4 border-t border-stone-100">
              <span className="font-poppins font-semibold text-[16px] text-[#1C1917]">Total</span>
              <span className="font-poppins font-bold text-[20px] text-[#1C1917]">Rs. 5440.00</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col gap-3 w-full pb-[100px]">
            <h3 className="font-poppins font-medium text-[15px] text-[#1C1917] uppercase tracking-wider mb-2">
              Payment Method
            </h3>
            
            <div className="flex flex-col border border-stone-200 rounded-[24px] overflow-hidden bg-white shadow-sm">
              
              {/* Cash on Delivery */}
              <label className={`flex flex-col p-4 cursor-pointer hover:bg-stone-50 transition-colors border-b border-stone-200 ${paymentMethod === 'cod' ? 'bg-stone-50/50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${paymentMethod === 'cod' ? 'border-[#1C1917] bg-[#1C1917]' : 'border-stone-300 bg-white'}`}>
                    {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                  <div className="flex items-center gap-2">
                    <Banknote size={18} className="text-stone-500" />
                    <span className="font-poppins text-[15px] text-[#1C1917] font-medium">Cash on delivery</span>
                  </div>
                </div>
              </label>

              {/* Mintpay */}
              <label className={`flex flex-col p-4 cursor-pointer hover:bg-stone-50 transition-colors border-b border-stone-200 ${paymentMethod === 'mintpay' ? 'bg-stone-50/50' : ''}`}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${paymentMethod === 'mintpay' ? 'border-[#1C1917] bg-[#1C1917]' : 'border-stone-300 bg-white'}`}>
                      {paymentMethod === 'mintpay' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <input type="radio" name="payment" checked={paymentMethod === 'mintpay'} onChange={() => setPaymentMethod('mintpay')} className="hidden" />
                    <span className="font-poppins text-[15px] text-[#1C1917] font-medium">Mintpay</span>
                  </div>
                  <span className="font-poppins text-[11px] font-semibold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-sm">Pay Later</span>
                </div>
              </label>

              {/* Koko */}
              <label className={`flex flex-col p-4 cursor-pointer hover:bg-stone-50 transition-colors border-b border-stone-200 ${paymentMethod === 'koko' ? 'bg-stone-50/50' : ''}`}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${paymentMethod === 'koko' ? 'border-[#1C1917] bg-[#1C1917]' : 'border-stone-300 bg-white'}`}>
                      {paymentMethod === 'koko' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <input type="radio" name="payment" checked={paymentMethod === 'koko'} onChange={() => setPaymentMethod('koko')} className="hidden" />
                    <span className="font-poppins text-[15px] text-[#1C1917] font-medium">Koko: BNPL</span>
                  </div>
                  <span className="font-poppins text-[11px] font-semibold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-sm">Pay Later</span>
                </div>
              </label>

              {/* Payzy */}
              <label className={`flex flex-col p-4 cursor-pointer hover:bg-stone-50 transition-colors border-b border-stone-200 ${paymentMethod === 'payzy' ? 'bg-stone-50/50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${paymentMethod === 'payzy' ? 'border-[#1C1917] bg-[#1C1917]' : 'border-stone-300 bg-white'}`}>
                    {paymentMethod === 'payzy' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <input type="radio" name="payment" checked={paymentMethod === 'payzy'} onChange={() => setPaymentMethod('payzy')} className="hidden" />
                  <span className="font-poppins text-[15px] text-[#1C1917] font-medium">Payzy</span>
                </div>
              </label>

              {/* Credit Card / Bank Account */}
              <label className={`flex flex-col p-4 cursor-pointer hover:bg-stone-50 transition-colors ${paymentMethod === 'onepay' ? 'bg-stone-50/50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${paymentMethod === 'onepay' ? 'border-[#1C1917] bg-[#1C1917]' : 'border-stone-300 bg-white'}`}>
                    {paymentMethod === 'onepay' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <input type="radio" name="payment" checked={paymentMethod === 'onepay'} onChange={() => setPaymentMethod('onepay')} className="hidden" />
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-stone-500" />
                    <span className="font-poppins text-[15px] text-[#1C1917] font-medium">Bank Card / Bank Account</span>
                  </div>
                </div>
                
                {/* Expanded Card Details (OnePay) */}
                {paymentMethod === 'onepay' && (
                  <div className="ml-9 mt-4 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 text-stone-500 bg-white p-3 rounded-lg border border-stone-200 shadow-sm text-sm font-poppins">
                      <ShieldCheck size={18} className="text-emerald-600" />
                      Secure checkout powered by OnePay
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Desktop Place Order Button */}
            <div className="hidden lg:flex w-full pt-6">
               <button 
                onClick={(e) => {
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                }}
                className="w-full h-[54px] flex justify-center items-center bg-[#1C1917] hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-[14px] text-white uppercase tracking-widest shadow-lg hover:shadow-xl"
              >
                Place Order
              </button>
            </div>

          </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d6d3d1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a29e;
        }
      `}</style>
    </main>
  );
}
