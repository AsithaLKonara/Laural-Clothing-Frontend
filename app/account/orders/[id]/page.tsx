import Link from "next/link";
import { ArrowLeft, CheckCircle2, Truck, PackageCheck, CreditCard } from "lucide-react";
import Image from "next/image";

export default async function CustomerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <div className="flex flex-col gap-6 w-full">
      
      <Link href="/account" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors w-fit">
        <ArrowLeft size={16} /> Back to Overview
      </Link>

      <div className="flex flex-col gap-2">
        <h2 className="font-signature text-3xl text-stone-900">Order #{id}</h2>
        <p className="font-inter text-sm text-stone-500">Placed on August 12, 2026</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        
        {/* Left Column: Timeline & Items */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Status Timeline */}
          <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
            <h3 className="font-inter font-bold text-lg text-stone-900 mb-6">Track Order</h3>
            
            <div className="flex flex-col gap-6 relative">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-stone-100 z-0"></div>
              
              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white]">
                  <CheckCircle2 size={14} />
                </div>
                <div className="flex flex-col pb-2">
                  <span className="font-inter font-bold text-sm text-stone-900">Order Confirmed</span>
                  <span className="font-inter text-xs text-stone-500">12:45 PM, Aug 12</span>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white]">
                  <CreditCard size={14} />
                </div>
                <div className="flex flex-col pb-2">
                  <span className="font-inter font-bold text-sm text-stone-900">Paid via Koko</span>
                  <span className="font-inter text-xs text-stone-500">12:46 PM, Aug 12</span>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white]">
                  <PackageCheck size={14} />
                </div>
                <div className="flex flex-col pb-2">
                  <span className="font-inter font-bold text-sm text-stone-900">Processing</span>
                  <span className="font-inter text-xs text-stone-500">Your order is being prepared</span>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-400 flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white]">
                  <Truck size={14} />
                </div>
                <div className="flex flex-col pb-2">
                  <span className="font-inter font-bold text-sm text-stone-400">Shipped</span>
                  <span className="font-inter text-xs text-stone-400">Awaiting shipment</span>
                </div>
              </div>

            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
            <h3 className="font-inter font-bold text-lg text-stone-900 mb-6">Items</h3>
            
            <div className="flex flex-col gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 pb-6 border-b border-stone-100 last:border-0 last:pb-0">
                  <div className="w-20 h-24 bg-stone-100 rounded-md shrink-0"></div>
                  <div className="flex flex-col flex-1">
                    <span className="font-inter font-bold text-stone-900 text-sm">Black Oversized T-Shirt</span>
                    <span className="font-inter text-sm text-stone-500">Size: M</span>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-inter text-sm text-stone-500">Qty: 1</span>
                      <span className="font-inter font-bold text-stone-900 text-sm">Rs. 2,500</span>
                    </div>
                  </div>
                </div>
              ))}
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
                <span>Rs. 5,000</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>Rs. 350</span>
              </div>
              <div className="h-px bg-stone-200 my-1"></div>
              <div className="flex justify-between font-bold text-stone-900 text-base">
                <span>Total</span>
                <span>Rs. 5,350</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-inter font-bold text-stone-900 mb-4 text-sm uppercase tracking-wider">Shipping Address</h3>
            <div className="flex flex-col font-inter text-sm text-stone-600 leading-relaxed">
              <span className="font-bold text-stone-900">Kasun Perera</span>
              <span>123/4, Flower Road</span>
              <span>Colombo 07</span>
              <span>Sri Lanka</span>
              <span className="mt-2 pt-2 border-t border-stone-100">077 123 4567</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
