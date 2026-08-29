"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronRight, Package, Loader2, Award, ShieldCheck } from "lucide-react";
import { useOrderConfirmation } from "@/hooks/useOrders";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || searchParams.get("orderId") || searchParams.get("reference") || "";
  const isSimulated = searchParams.get("simulated") === "true";
  const gatewayParam = searchParams.get("gateway");

  const { data: order, isLoading, isError } = useOrderConfirmation(orderNumber, isSimulated);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <Loader2 className="animate-spin text-stone-400 mb-4" size={40} />
        <p className="font-poppins text-stone-500">Retrieving your order details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center max-w-[600px] w-full bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-stone-100 animate-in zoom-in-95 fade-in duration-500">
        <h1 className="font-poppins font-semibold text-2xl text-red-600 mb-2 text-center">
          Order Not Found
        </h1>
        <p className="font-poppins text-sm text-stone-500 text-center mb-8">
          We couldn't find the order details for #{orderNumber || "the requested order"}. If you just completed payment, please check your SMS or email for confirmation.
        </p>
        <Link 
          href="/shop"
          className="flex items-center justify-center gap-2 w-full h-[54px] bg-primary text-white hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-sm uppercase tracking-widest"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Format amount
  const formattedTotal = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR'
  }).format(order.total);

  // Format date
  const formattedDate = order.createdAt ? new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(order.createdAt)) : "Today";

  const isPaid = order.paymentStatus === 'PAID';
  const isOnePay = (order.paymentMethod || '').toUpperCase().includes('ONEPAY') || gatewayParam === 'onepay';
  const loyaltyPointsEarned = order.loyaltyPointsEarned || Math.round((order.total || 0) * 0.01);

  return (
    <div className="flex flex-col items-center max-w-[620px] w-full bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-stone-100 animate-in zoom-in-95 fade-in duration-500">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
        <CheckCircle2 size={40} />
      </div>

      {/* Title */}
      <h1 className="font-poppins font-semibold text-3xl md:text-4xl text-primary mb-2 text-center">
        Order Confirmed!
      </h1>
      <p className="font-poppins text-sm text-stone-500 text-center mb-6">
        Thank you for your purchase. We've received your order and our team has started processing it.
      </p>

      {/* OnePay Badge if paid via OnePay */}
      {isOnePay && (
        <div className="flex items-center gap-2 bg-blue-50 text-blue-800 border border-blue-100 px-4 py-2 rounded-xl text-xs font-poppins font-medium mb-6">
          <ShieldCheck size={16} className="text-blue-600 shrink-0" />
          <span>Payment secured & verified via OnePay Payment Gateway</span>
        </div>
      )}

      {/* Loyalty Points Earned Notification */}
      {loyaltyPointsEarned > 0 && (
        <div className="flex items-center gap-3 w-full bg-emerald-50/80 border border-emerald-200/60 rounded-2xl p-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Award size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-poppins font-semibold text-sm text-emerald-900">
              +{loyaltyPointsEarned} Loyalty Points Earned!
            </span>
            <span className="font-poppins text-xs text-emerald-700">
              1% points credited to your account balance for future discounts.
            </span>
          </div>
        </div>
      )}

      {/* Order Details Card */}
      <div className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-6 flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center w-full border-b border-stone-200 pb-4">
          <span className="font-poppins text-sm text-stone-500">Order Number</span>
          <span className="font-poppins font-semibold text-sm text-primary">#{order.orderNumber || order.id?.substring(0, 8)}</span>
        </div>
        <div className="flex justify-between items-center w-full border-b border-stone-200 pb-4">
          <span className="font-poppins text-sm text-stone-500">Date</span>
          <span className="font-poppins font-medium text-sm text-primary">{formattedDate}</span>
        </div>
        <div className="flex justify-between items-center w-full border-b border-stone-200 pb-4">
          <span className="font-poppins text-sm text-stone-500">Payment Method</span>
          <div className="flex items-center gap-2">
            <span className="font-poppins font-medium text-sm text-primary uppercase">
              {isOnePay ? 'OnePay (Bank Card / Account)' : (order.paymentGateway || order.paymentMethod || 'Standard')}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-700'}`}>
              {order.paymentStatus || (isPaid ? 'PAID' : 'PENDING')}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center w-full pt-1">
          <span className="font-poppins font-semibold text-base text-primary">Total Amount</span>
          <span className="font-poppins font-bold text-lg text-accent">{formattedTotal}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        <Link 
          href="/track-order"
          className="flex items-center justify-center gap-2 w-full h-[54px] bg-white border border-primary text-primary hover:bg-stone-100 transition-colors rounded-full font-poppins font-semibold text-sm uppercase tracking-widest"
        >
          <Package size={18} />
          Track Order
        </Link>
        
        <Link 
          href="/shop"
          className="flex items-center justify-center gap-2 w-full h-[54px] bg-primary text-white hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-sm uppercase tracking-widest"
        >
          Continue Shopping
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-background pt-[120px] pb-24 px-4">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
          <Loader2 className="animate-spin text-stone-400 mb-4" size={40} />
        </div>
      }>
        <CheckoutSuccessContent />
      </Suspense>
    </main>
  );
}
