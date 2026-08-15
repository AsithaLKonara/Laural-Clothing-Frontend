import PageHeader from "@/components/dashboard/PageHeader";
import { OrderStatusBadge, PaymentGatewayBadge } from "@/components/dashboard/Badges";
import Link from "next/link";
import { ArrowLeft, User, CreditCard, Truck, MapPin } from "lucide-react";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-6">
      
      {/* Back Link */}
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors w-fit">
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <PageHeader 
        title={`Order #${id}`}
        action={
          <div className="flex gap-2">
            <OrderStatusBadge status="Paid" />
            <OrderStatusBadge status="Processing" />
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Customer, Payment, Shipping */}
        <div className="md:col-span-1 flex flex-col gap-6">
          
          {/* Customer */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm font-inter">
              <User size={16} className="text-stone-400" />
              Customer
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-inter text-sm text-stone-800">Kasun Perera</span>
              <span className="font-inter text-sm text-stone-500">0771234567</span>
              <Link href="#" className="font-inter text-xs text-blue-600 hover:underline mt-1">View Profile</Link>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm font-inter">
              <CreditCard size={16} className="text-stone-400" />
              Payment
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm text-stone-500">Gateway</span>
                <PaymentGatewayBadge gateway="Koko" status="paid" />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm text-stone-500">Method</span>
                <span className="font-inter text-sm text-stone-800">Buy Now Pay Later</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm text-stone-500">Transaction</span>
                <span className="font-inter text-sm text-stone-800 font-mono">KOKO-82931</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm text-stone-500">Amount</span>
                <span className="font-inter text-sm text-stone-800 font-bold">Rs. 8,500</span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm font-inter">
              <Truck size={16} className="text-stone-400" />
              Shipment
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm text-stone-500">Courier</span>
                <span className="font-inter text-sm text-stone-800">Fardar</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm text-stone-500">Tracking</span>
                <span className="font-inter text-sm text-blue-600 hover:underline cursor-pointer">FRD-29381</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm text-stone-500">Status</span>
                <span className="font-inter text-sm text-stone-800">In Transit</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Col: Timeline & Items */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-stone-900 font-semibold text-sm font-inter">Timeline</h3>
            
            <div className="flex flex-col gap-4 mt-2">
              {[
                { time: "12:41 PM", desc: "Order placed", active: true },
                { time: "12:42 PM", desc: "Payment confirmed (Koko)", active: true },
                { time: "01:15 PM", desc: "Order processing", active: true },
                { time: "02:30 PM", desc: "Packed", active: true },
                { time: "04:00 PM", desc: "Shipped via Fardar", active: true },
                { time: "Today 09:00 AM", desc: "In transit", active: true },
                { time: "-", desc: "Delivered", active: false },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${step.active ? 'bg-emerald-500' : 'bg-stone-200'} shrink-0 mt-1.5`}></div>
                    {idx !== 6 && <div className={`w-px h-8 ${step.active ? 'bg-emerald-500' : 'bg-stone-200'} mt-1`}></div>}
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-inter text-sm ${step.active ? 'text-stone-900' : 'text-stone-400'}`}>{step.desc}</span>
                    <span className="font-inter text-xs text-stone-500">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
