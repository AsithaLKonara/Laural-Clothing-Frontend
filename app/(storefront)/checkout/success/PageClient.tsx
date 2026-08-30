"use client";

import React, { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronRight, Package, Loader2 } from "lucide-react";
import { useOrderById } from "@/hooks/useOrders";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data: order, isLoading, isError } = useOrderById(orderId || "");

  const hasFiredPixel = useRef(false);
  useEffect(() => {
    if (order && !hasFiredPixel.current) {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', {
          value: order.total,
          currency: 'LKR',
          content_ids: order.items?.map((item: any) => item.productVariant?.product?.id) || [],
          content_type: 'product',
        });
      }
      hasFiredPixel.current = true;
    }
  }, [order]);

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
          We couldn't find the order details for the provided ID. If you just placed this order, please check your email for the confirmation.
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
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(order.createdAt));

  return (
    <div className="flex flex-col items-center max-w-[600px] w-full bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-stone-100 animate-in zoom-in-95 fade-in duration-500">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
        <CheckCircle2 size={40} />
      </div>

      {/* Title */}
      <h1 className="font-poppins font-semibold text-3xl md:text-4xl text-primary mb-2 text-center">
        Order Confirmed!
      </h1>
      <p className="font-poppins text-sm text-stone-500 text-center mb-8">
        Thank you for your purchase. We've received your order and will begin processing it right away.
      </p>

      {/* Order Details Card */}
      <div className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-6 flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center w-full border-b border-stone-200 pb-4">
          <span className="font-poppins text-sm text-stone-500">Order Number</span>
          <span className="font-poppins font-medium text-sm text-primary">#{order.orderNumber || order.id.substring(0, 8)}</span>
        </div>
        <div className="flex justify-between items-center w-full border-b border-stone-200 pb-4">
          <span className="font-poppins text-sm text-stone-500">Date</span>
          <span className="font-poppins font-medium text-sm text-primary">{formattedDate}</span>
        </div>
        <div className="flex justify-between items-center w-full border-b border-stone-200 pb-4">
          <span className="font-poppins text-sm text-stone-500">Payment Method</span>
          <span className="font-poppins font-medium text-sm text-primary uppercase">{order.paymentGateway || order.paymentMethod || 'Standard'}</span>
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
