"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Truck, PackageCheck, CreditCard, XCircle, Undo2 } from "lucide-react";
import Image from "next/image";
import { useOrderById } from "@/hooks/useOrders";
import { use, useState, useEffect } from "react";

export default function CustomerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data: order, isLoading, error } = useOrderById(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-stone-500">
        <p>Order not found or an error occurred.</p>
        <Link href="/account/orders" className="text-stone-900 underline mt-4">Go back to orders</Link>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress as any;
  const isCancelled = order.status === 'CANCELLED';
  const isDelivered = order.status === 'DELIVERED';
  const isShipped = order.status === 'SHIPPED' || order.status === 'DISPATCHED';
  const isProcessing = order.status === 'PROCESSING' || isShipped || isDelivered;
  const isConfirmed = order.status !== 'PENDING' && !isCancelled;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors w-fit">
        <ArrowLeft size={16} /> Back to Overview
      </Link>

      <div className="flex flex-col gap-2">
        <h2 className="font-signature text-3xl text-stone-900">Order #{order.orderNumber}</h2>
        <p className="font-inter text-sm text-stone-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        
        {/* Left Column: Timeline & Items */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Status Timeline */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 md:p-8 shadow-sm">
            <h3 className="font-inter font-bold text-lg text-stone-900 mb-6">Track Order</h3>
            
            {isCancelled ? (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <XCircle size={18} />
                </div>
                <div className="flex flex-col pb-2">
                  <span className="font-inter font-bold text-base text-red-600">Order Cancelled</span>
                  <span className="font-inter text-sm text-stone-500">This order has been cancelled and refunded if applicable.</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-stone-100 z-0"></div>
                
                {/* Order Placed */}
                <div className="flex gap-4 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] ${true ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-400'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="flex flex-col pb-2">
                    <span className={`font-inter font-bold text-sm ${true ? 'text-stone-900' : 'text-stone-400'}`}>Order Placed</span>
                    <span className="font-inter text-xs text-stone-500">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Paid */}
                <div className="flex gap-4 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] ${isConfirmed ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-400'}`}>
                    <CreditCard size={16} />
                  </div>
                  <div className="flex flex-col pb-2">
                    <span className={`font-inter font-bold text-sm ${isConfirmed ? 'text-stone-900' : 'text-stone-400'}`}>
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery Accepted' : `Paid via ${order.paymentMethod}`}
                    </span>
                    {isConfirmed && <span className="font-inter text-xs text-stone-500">Payment Confirmed</span>}
                  </div>
                </div>

                {/* Processing */}
                <div className="flex gap-4 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] ${isProcessing ? 'bg-blue-500 text-white' : 'bg-stone-200 text-stone-400'}`}>
                    <PackageCheck size={16} />
                  </div>
                  <div className="flex flex-col pb-2">
                    <span className={`font-inter font-bold text-sm ${isProcessing ? 'text-stone-900' : 'text-stone-400'}`}>Processing</span>
                    <span className="font-inter text-xs text-stone-500">{isProcessing ? "Your order is being prepared" : "Awaiting processing"}</span>
                  </div>
                </div>

                {/* Shipped */}
                <div className="flex gap-4 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] ${isShipped ? 'bg-purple-500 text-white' : 'bg-stone-200 text-stone-400'}`}>
                    <Truck size={16} />
                  </div>
                  <div className="flex flex-col pb-2">
                    <span className={`font-inter font-bold text-sm ${isShipped ? 'text-stone-900' : 'text-stone-400'}`}>Shipped</span>
                    <span className="font-inter text-xs text-stone-500">{isShipped ? (order.trackingNumber ? `Tracking: ${order.trackingNumber}` : 'Out for delivery') : 'Awaiting shipment'}</span>
                  </div>
                </div>

                {/* Delivered */}
                <div className="flex gap-4 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] ${isDelivered ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-400'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="flex flex-col pb-2">
                    <span className={`font-inter font-bold text-sm ${isDelivered ? 'text-stone-900' : 'text-stone-400'}`}>Delivered</span>
                    <span className="font-inter text-xs text-stone-500">{isDelivered ? "Package has been delivered" : 'Pending delivery'}</span>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 md:p-8 shadow-sm">
            <h3 className="font-inter font-bold text-lg text-stone-900 mb-6">Items ({order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)})</h3>
            
            <div className="flex flex-col gap-6">
              {order.items.map((item: any) => {
                const variantName = item.variant?.name || '';
                const productName = item.variant?.product?.name || 'Unknown Product';
                let imageUrl = '';
                if (item.variant?.featuredImage) imageUrl = item.variant.featuredImage;
                else if (item.variant?.product?.variants?.[0]?.featuredImage) imageUrl = item.variant.product.variants[0].featuredImage;

                return (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-stone-100 last:border-0 last:pb-0">
                    <div className="w-20 h-24 relative bg-stone-100 rounded-md overflow-hidden shrink-0">
                      {imageUrl && <Image src={imageUrl} alt={productName} fill className="object-cover" />}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-inter font-bold text-stone-900 text-sm">{productName}</span>
                      <span className="font-inter text-sm text-stone-500">{variantName}</span>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-inter text-sm text-stone-500">Qty: {item.quantity}</span>
                        <span className="font-inter font-bold text-stone-900 text-sm">Rs. {item.priceAtPurchase.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Summary & Info */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
            <h3 className="font-inter font-bold text-stone-900 mb-4">Order Summary</h3>
            <div className="flex flex-col gap-3 font-inter text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>Rs. {order.shippingFee.toLocaleString()}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Tax</span>
                  <span>Rs. {order.tax.toLocaleString()}</span>
                </div>
              )}
              <div className="h-px bg-stone-200 my-1"></div>
              <div className="flex justify-between font-bold text-stone-900 text-base">
                <span>Total</span>
                <span>Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-inter font-bold text-stone-900 mb-4 text-sm uppercase tracking-wider">Shipping Address</h3>
            <div className="flex flex-col font-inter text-sm text-stone-600 leading-relaxed">
              <span className="font-bold text-stone-900">{shippingAddress?.firstName} {shippingAddress?.lastName}</span>
              <span>{shippingAddress?.addressLine1}</span>
              {shippingAddress?.addressLine2 && <span>{shippingAddress.addressLine2}</span>}
              <span>{shippingAddress?.city} {shippingAddress?.postalCode}</span>
              <span className="mt-2 pt-2 border-t border-stone-100">{shippingAddress?.phone}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
