"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { TicketPercent, CreditCard, Banknote, ShieldCheck, Award, ChevronDown } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import LoyaltyPointsModal from "@/components/LoyaltyPointsModal";
import OtpVerificationModal from "@/components/OtpVerificationModal";
import { useAuthStore } from "@/store/auth.store";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormData } from "@/lib/validations";
import { useCartStore } from "@/store/useCartStore";
import { useCart } from "@/hooks/useCart";
import { useInitiateCheckout } from "@/hooks/useCheckout";
import { useRouter } from "next/navigation";
import { useAddresses, useAddAddress, MOCK_CUSTOMER_ID } from "@/hooks/useAddress";
import { globalDialog } from "@/store/dialog.store";
import { generateDeviceFingerprint, isLikelyBot } from "@/lib/fingerprint";
import { Turnstile } from "@marsidev/react-turnstile";
import { paymentService } from "@/services/payment.service";

export default function CheckoutPage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      billingSameAsShipping: true,
      paymentMethod: "cod",
    },
  });

  const billingSameAsShipping = watch("billingSameAsShipping");
  const paymentMethod = watch("paymentMethod");

  const [discountCode, setDiscountCode] = useState("");
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    paymentService.getPaymentMethods()
      .then(methods => setAvailablePaymentMethods(methods))
      .catch(err => console.error("Failed to fetch payment methods", err));
  }, []);
  const [appliedLoyaltyPoints, setAppliedLoyaltyPoints] = useState<number>(0);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [pendingCheckoutData, setPendingCheckoutData] = useState<CheckoutFormData | null>(null);
  const [verificationToken, setVerificationToken] = useState("");

  const router = useRouter();
  const sessionId = useCartStore((state) => state.sessionId);
  const { data: cart, isPending: isCartPending } = useCart(sessionId);
  const initiateCheckout = useInitiateCheckout(sessionId);
  const { data: addresses } = useAddresses(MOCK_CUSTOMER_ID);
  const addAddress = useAddAddress(MOCK_CUSTOMER_ID);
  const [saveAddress, setSaveAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * (item.variant.salePrice ?? item.variant.price)), 0);
  const shippingFee = 400; // Flat fee for now
  const total = subtotal + shippingFee - appliedLoyaltyPoints;

  const hasFiredPixel = useRef(false);
  useEffect(() => {
    if (!isCartPending && cartItems.length > 0 && !hasFiredPixel.current) {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          content_ids: cartItems.map(item => item.variant.product.id),
          content_type: 'product',
          num_items: cartItems.length,
          value: total,
          currency: 'LKR'
        });
      }
      hasFiredPixel.current = true;
    }
  }, [isCartPending, cartItems, total]);

  const handleSelectAddress = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedAddressId(id);
    if (!id) return;
    const addr = addresses?.find(a => a.id === id);
    if (addr) {
      setValue("fullName", `${addr.firstName} ${addr.lastName}`);
      setValue("addressLine1", addr.addressLine1);
      setValue("addressLine2", addr.addressLine2 || "");
      setValue("city", addr.city);
      setValue("phone", addr.phone);
    }
  };

  const executeCheckout = (data: CheckoutFormData, token?: string) => {
    if (!cart?.id) return;

    if (saveAddress && !selectedAddressId) {
      addAddress.mutate({
        firstName: data.fullName.split(' ')[0],
        lastName: data.fullName.split(' ').slice(1).join(' '),
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        city: data.city,
        postalCode: null,
        phone: data.phone,
        type: "SHIPPING",
        isDefault: false
      });
    }
    
    initiateCheckout.mutate(
      {
        cartId: cart.id,
        verificationToken: token || verificationToken,
        customer: {
          phone: data.phone,
          email: data.email,
          firstName: data.fullName.split(' ')[0],
          lastName: data.fullName.split(' ').slice(1).join(' '),
        },
        shippingAddress: {
          firstName: data.fullName.split(' ')[0],
          lastName: data.fullName.split(' ').slice(1).join(' '),
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          phone: data.phone,
        },
        paymentMethod: data.paymentMethod,
        deviceFingerprint: data.deviceFingerprint,
        pointsToRedeem: appliedLoyaltyPoints,
        turnstileToken: data.turnstileToken,
      },
      {
        onSuccess: (data) => {
          setPendingCheckoutData(null);
          const { order, payment } = data;
          
          if (data.paymentMethod !== 'cod' && payment?.redirectUrl) {
            window.location.href = payment.redirectUrl;
          } else {
            router.push(`/checkout/success?orderNumber=${order.orderNumber}`);
          }
        },
        onError: (error) => {
          console.error("Checkout failed:", error);
          globalDialog.alert("Checkout failed. Please try again.");
        }
      }
    );
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cart?.id) return;

    // Pre-flight bot check — reject obvious automation before any API call
    if (isLikelyBot()) {
      globalDialog.alert(
        "Automated checkout is not permitted. Please complete the checkout manually.",
        "Checkout Unavailable"
      );
      return;
    }

    if (!isAuthenticated && !isPhoneVerified) {
      setPendingCheckoutData(data);
      setIsOtpModalOpen(true);
      return;
    }
    
    // Generate fingerprint right before submission
    data.deviceFingerprint = await generateDeviceFingerprint();
    
    executeCheckout(data);
  };

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-background pt-[83px]">
      <div className="flex flex-col lg:flex-row w-full max-w-[1280px] mx-auto py-[60px] px-4 md:px-[80px] lg:px-[120px] gap-12 lg:gap-[60px]">
        
        {/* Left Column: Forms */}
        <div className="flex flex-col flex-1 w-full lg:pr-[60px] lg:border-r lg:border-stone-200 gap-10">
          <div className="flex flex-col gap-2">
            <h1 className="font-poppins font-medium text-4xl md:text-5xl text-primary leading-tight">
              Checkout
            </h1>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 w-full">
            {/* Honeypot Field */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input type="text" {...register('_honeypot' as any)} tabIndex={-1} autoComplete="off" />
            </div>
            
            {/* Shipping Information */}
            <div className="flex flex-col gap-6 w-full">
              <h2 className="font-poppins font-medium text-xl text-primary flex items-center justify-between">
                Shipping Information
              </h2>
              
              {addresses && addresses.length > 0 && (
                <div className="flex flex-col gap-2 w-full mb-2">
                  <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                    Use Saved Address
                  </label>
                  <div className="relative">
                    <select
                      value={selectedAddressId}
                      onChange={handleSelectAddress}
                      className="w-full h-[52px] px-[20px] appearance-none border border-stone-200 rounded-full bg-stone-50 font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    >
                      <option value="">-- Select an address --</option>
                      {addresses.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.firstName} {a.lastName} - {a.addressLine1}, {a.city}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={18} />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-5 w-full">
                {/* Full Name */}
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                    Full name <span className="text-accent">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter full name"
                    {...register("fullName")}
                    className={`w-full h-[52px] px-[20px] border ${errors.fullName ? 'border-red-500' : 'border-stone-200'} rounded-full bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-stone-400`}
                  />
                  {errors.fullName && <span className="text-red-500 text-xs mt-1 pl-4">{errors.fullName.message}</span>}
                </div>

                {/* Address Lines */}
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                    Address <span className="text-accent">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Address Line 1"
                    {...register("addressLine1")}
                    className={`w-full h-[52px] px-[20px] border ${errors.addressLine1 ? 'border-red-500' : 'border-stone-200'} rounded-full bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-stone-400 mb-2`}
                  />
                  {errors.addressLine1 && <span className="text-red-500 text-xs mt-0 mb-2 pl-4">{errors.addressLine1.message}</span>}
                  
                  <input 
                    type="text" 
                    placeholder="Address Line 2 (Optional)"
                    {...register("addressLine2")}
                    className="w-full h-[52px] px-[20px] border border-stone-200 rounded-full bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-stone-400"
                  />
                </div>

                {/* City */}
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                    City <span className="text-accent">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter city"
                    {...register("city")}
                    className={`w-full h-[52px] px-[20px] border ${errors.city ? 'border-red-500' : 'border-stone-200'} rounded-full bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-stone-400`}
                  />
                  {errors.city && <span className="text-red-500 text-xs mt-1 pl-4">{errors.city.message}</span>}
                </div>

                {/* Phone & Email (Row on Desktop) */}
                <div className="flex flex-col md:flex-row gap-5 w-full">
                  {/* Phone */}
                  <div className="flex flex-col gap-2 w-full flex-1">
                    <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                      Phone number <span className="text-accent">*</span>
                    </label>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput 
                          placeholder="Enter phone number"
                          value={field.value}
                          onChange={field.onChange}
                          defaultCountry="LK"
                          className={`w-full h-[52px] px-[20px] border ${errors.phone ? 'border-red-500' : 'border-stone-200'} rounded-full bg-white font-poppins text-sm text-primary outline-none focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all`}
                          numberInputProps={{
                            className: "w-full h-full bg-transparent border-none outline-none text-primary font-poppins text-sm placeholder:text-stone-400 pl-4",
                          }}
                        />
                      )}
                    />
                    {errors.phone && <span className="text-red-500 text-xs mt-1 pl-4">{errors.phone.message}</span>}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2 w-full flex-1">
                    <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                      Email address <span className="text-accent">*</span>
                    </label>
                    <input 
                      type="email" 
                      placeholder="Enter email address"
                      {...register("email")}
                      className={`w-full h-[52px] px-[20px] border ${errors.email ? 'border-red-500' : 'border-stone-200'} rounded-full bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-stone-400`}
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1 pl-4">{errors.email.message}</span>}
                  </div>
                </div>
              </div>

              {/* Save Address Checkbox */}
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="saveAddress" 
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="w-5 h-5 accent-[#1C1917] rounded-sm cursor-pointer"
                  />
                  <label htmlFor="saveAddress" className="font-poppins text-sm text-primary cursor-pointer select-none mt-1">
                    Save this address to my profile
                  </label>
                </div>
              </div>
            </div>

            {/* Checkbox for T&C */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="terms" 
                  {...register("termsAccepted")}
                  className="w-5 h-5 accent-[#1C1917] rounded-sm cursor-pointer"
                />
                <label htmlFor="terms" className="font-poppins text-sm text-primary cursor-pointer select-none mt-1">
                  I have read and agree to the Terms and Conditions.
                </label>
              </div>
              {errors.termsAccepted && <span className="text-red-500 text-xs mt-1 pl-8">{errors.termsAccepted.message}</span>}
            </div>

            {/* Billing Address Toggle */}
            <div className="flex flex-col gap-4 w-full">
              <h2 className="font-poppins font-medium text-xl text-primary">
                Billing Address <span className="text-accent">*</span>
              </h2>
              <div className="flex flex-col border border-stone-200 rounded-[24px] overflow-hidden bg-white shadow-sm">
                
                {/* Same as Shipping */}
                <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-stone-50 transition-colors border-b border-stone-200">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${billingSameAsShipping ? 'border-primary bg-primary' : 'border-stone-300 bg-white'}`}>
                    {billingSameAsShipping && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <input 
                    type="radio" 
                    value="true"
                    checked={billingSameAsShipping === true}
                    onChange={() => setValue("billingSameAsShipping", true)}
                    className="hidden" 
                  />
                  <span className="font-poppins text-sm text-primary font-medium">Same as shipping address</span>
                </label>

                {/* Different Billing */}
                <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${!billingSameAsShipping ? 'border-primary bg-primary' : 'border-stone-300 bg-white'}`}>
                    {!billingSameAsShipping && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <input 
                    type="radio" 
                    value="false"
                    checked={billingSameAsShipping === false}
                    onChange={() => setValue("billingSameAsShipping", false)}
                    className="hidden" 
                  />
                  <span className="font-poppins text-sm text-primary font-medium">Use a different billing address</span>
                </label>

              </div>
            </div>

            {/* If different billing, show partial form */}
            {!billingSameAsShipping && (
              <div className="flex flex-col gap-5 w-full animate-in fade-in slide-in-from-top-4 duration-300 bg-white p-6 rounded-[24px] border border-stone-200 shadow-sm">
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                    Billing Address <span className="text-accent">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Address Line 1"
                    {...register("billingAddressLine1")}
                    className={`w-full h-[52px] px-[20px] border ${errors.billingAddressLine1 ? 'border-red-500' : 'border-stone-200'} rounded-full bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-stone-400`}
                  />
                  {errors.billingAddressLine1 && <span className="text-red-500 text-xs mt-1 pl-4">{errors.billingAddressLine1.message}</span>}
                </div>
                <div className="flex flex-col md:flex-row gap-5 w-full">
                  <div className="flex flex-col gap-2 w-full flex-1">
                    <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                      City <span className="text-accent">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter city"
                      {...register("billingCity")}
                      className={`w-full h-[52px] px-[20px] border ${errors.billingCity ? 'border-red-500' : 'border-stone-200'} rounded-full bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-stone-400`}
                    />
                    {errors.billingCity && <span className="text-red-500 text-xs mt-1 pl-4">{errors.billingCity.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2 w-full flex-1">
                    <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
                      Phone <span className="text-accent">*</span>
                    </label>
                    <Controller
                      name="billingPhone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput 
                          placeholder="Enter phone number"
                          value={field.value}
                          onChange={field.onChange}
                          defaultCountry="LK"
                          className={`w-full h-[52px] px-[20px] border ${errors.billingPhone ? 'border-red-500' : 'border-stone-200'} rounded-full bg-white font-poppins text-sm text-primary outline-none focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all`}
                          numberInputProps={{
                            className: "w-full h-full bg-transparent border-none outline-none text-primary font-poppins text-sm placeholder:text-stone-400 pl-4",
                          }}
                        />
                      )}
                    />
                    {errors.billingPhone && <span className="text-red-500 text-xs mt-1 pl-4">{errors.billingPhone.message}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Turnstile CAPTCHA */}
            <div className="flex justify-center w-full my-4">
              {mounted && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} onSuccess={(token) => setValue("turnstileToken", token)} />
              )}
            </div>

            {/* Mobile Place Order Button (Shows above cart on mobile) */}
            <div className="flex lg:hidden w-full pt-4">
               <button 
                type="submit"
                disabled={initiateCheckout.isPending || cartItems.length === 0}
                className="w-full h-[54px] flex justify-center items-center bg-primary hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest disabled:opacity-50"
              >
                {initiateCheckout.isPending ? "Processing..." : "Place Order"}
              </button>
            </div>
            
          </form>
        </div>

        {/* Right Column: Order Summary & Payment */}
        <div className="flex flex-col w-full lg:w-[420px] gap-8">
          
          <h2 className="font-poppins font-medium text-xl text-primary">
            Review your cart
          </h2>

          {/* Cart Items */}
          <div className="flex flex-col w-full gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {isCartPending ? (
              <p className="text-stone-500 font-poppins text-sm">Loading cart...</p>
            ) : cartItems.length === 0 ? (
              <p className="text-stone-500 font-poppins text-sm">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex flex-row items-center w-full p-3 bg-white border border-stone-200 rounded-xl shadow-sm gap-4">
                  <div className="w-[70px] h-[70px] relative bg-stone-100 rounded-lg overflow-hidden shrink-0">
                    {(() => {
                      let allImages: string[] = [];
                      if (item.variant.product?.variants) {
                        for (const v of item.variant.product.variants) {
                          if (v.featuredImage) allImages.push(v.featuredImage);
                          if (v.gallery) allImages.push(...v.gallery);
                        }
                      } else {
                        if (item.variant.featuredImage) allImages.push(item.variant.featuredImage);
                        if (item.variant.gallery) allImages.push(...item.variant.gallery);
                      }
                      
                      const imgUrl = allImages[0] || "/products/default.jpg";
                      
                      return (
                        <Image src={imgUrl} alt={item.variant.product.name} fill sizes="100px" className="object-cover object-top" />
                      );
                    })()}
                  </div>
                  <div className="flex flex-col flex-1 justify-center gap-1">
                    <h4 className="font-poppins font-medium text-xs text-primary leading-tight">
                      {item.variant.product.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-poppins text-xs text-stone-500">{item.variant.name}</span>
                      <span className="font-poppins font-medium text-xs text-primary">{item.quantity} × Rs: {(item.variant.salePrice ?? item.variant.price).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
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
              className="flex-1 h-[44px] bg-transparent border-none outline-none px-3 font-poppins text-sm text-primary placeholder:text-stone-400"
            />
            <button className="h-[44px] px-6 bg-stone-100 hover:bg-stone-200 transition-colors rounded-full font-poppins font-medium text-xs text-primary">
              Apply
            </button>
          </div>

          {/* Loyalty Points Button */}
          <button 
            onClick={() => setIsLoyaltyModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full h-[54px] bg-background border border-stone-300 hover:bg-stone-100 transition-colors rounded-full font-poppins font-medium text-sm text-primary"
          >
            <Award size={18} className="text-accent" />
            Check Loyalty Points
          </button>

          {/* Order Totals */}
          <div className="flex flex-col w-full gap-3 py-6 border-y border-stone-200">
            <div className="flex justify-between items-center w-full">
              <span className="font-poppins text-sm text-stone-500">Subtotal</span>
              <span className="font-poppins font-medium text-sm text-primary">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="font-poppins text-sm text-stone-500">Shipping</span>
              <span className="font-poppins font-medium text-sm text-primary">Rs. {shippingFee.toLocaleString()}</span>
            </div>
            {appliedLoyaltyPoints > 0 && (
              <div className="flex justify-between items-center w-full">
                <span className="font-poppins text-sm text-stone-500">Loyalty Points ({appliedLoyaltyPoints})</span>
                <span className="font-poppins font-medium text-sm text-emerald-600">-Rs. {appliedLoyaltyPoints.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center w-full mt-2 pt-4 border-t border-stone-100">
              <span className="font-poppins font-semibold text-base text-primary">Total</span>
              <span className="font-poppins font-bold text-xl text-primary">Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col gap-3 w-full pb-[100px]">
            <h3 className="font-poppins font-medium text-sm text-primary uppercase tracking-wider mb-2">
              Payment Method
            </h3>
            
            <div className="flex flex-col border border-stone-200 rounded-[24px] overflow-hidden bg-white shadow-sm">
              
              {availablePaymentMethods.length === 0 ? (
                <div className="p-8 text-center text-stone-500">Loading payment methods...</div>
              ) : (
                availablePaymentMethods.map((method, index) => (
                  <label key={method.id} className={`flex flex-col p-4 cursor-pointer hover:bg-stone-50 transition-colors ${index !== availablePaymentMethods.length - 1 ? 'border-b border-stone-200' : ''} ${paymentMethod === method.id ? 'bg-stone-50/50' : ''}`}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${paymentMethod === method.id ? 'border-primary bg-primary' : 'border-stone-300 bg-white'}`}>
                          {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <input type="radio" value={method.id} {...register("paymentMethod")} className="hidden" />
                        <div className="flex items-center gap-2">
                          {method.id === 'cod' && <Banknote size={18} className="text-stone-500" />}
                          {method.id === 'onepay' && <CreditCard size={18} className="text-stone-500" />}
                          <span className="font-poppins text-sm text-primary font-medium">{method.name}</span>
                        </div>
                      </div>
                      {method.badge && (
                        <span className="font-poppins text-[11px] font-semibold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-sm">{method.badge}</span>
                      )}
                    </div>
                    
                    {method.id === 'onepay' && paymentMethod === 'onepay' && (
                      <div className="ml-9 mt-4 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2 text-stone-500 bg-white p-3 rounded-lg border border-stone-200 shadow-sm text-sm font-poppins">
                          <ShieldCheck size={18} className="text-emerald-600" />
                          Secure checkout powered by OnePay
                        </div>
                      </div>
                    )}
                  </label>
                ))
              )}
            </div>

            {/* Desktop Place Order Button */}
            <div className="hidden lg:flex w-full pt-6">
               <button 
                type="button"
                onClick={(e) => {
                  const form = document.getElementById('checkout-form') as HTMLFormElement;
                  if (form) {
                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                  }
                }}
                className="w-full h-[54px] flex justify-center items-center bg-primary hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest shadow-lg hover:shadow-xl"
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
      <LoyaltyPointsModal 
        isOpen={isLoyaltyModalOpen} 
        onClose={() => setIsLoyaltyModalOpen(false)} 
        onApplyPoints={(points) => setAppliedLoyaltyPoints(points)} 
      />
      <OtpVerificationModal 
        isOpen={isOtpModalOpen}
        phone={pendingCheckoutData?.phone || ""}
        onClose={() => setIsOtpModalOpen(false)}
        onSuccess={(token) => {
          setIsPhoneVerified(true);
          setVerificationToken(token);
          setIsOtpModalOpen(false);
          if (pendingCheckoutData) {
            executeCheckout(pendingCheckoutData, token);
          }
        }}
      />

    </main>
  );
}
