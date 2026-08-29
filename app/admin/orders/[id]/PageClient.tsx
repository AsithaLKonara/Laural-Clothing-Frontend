"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import { OrderStatusBadge, PaymentGatewayBadge } from "@/components/dashboard/Badges";
import Link from "next/link";
import { ArrowLeft, User, CreditCard, Truck, RefreshCw } from "lucide-react";
import OrderDispatchButtons from "@/components/admin/OrderDispatchButtons";
import { useOrderById, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: order, isLoading } = useOrderById(id);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  if (isLoading) {
    return <div className="p-10 text-stone-500 font-inter">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-10 text-stone-500 font-inter">Order not found.</div>;
  }

  const customerName = order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Guest";
  const customerPhone = order.customer?.phone || "-";
  const address = order.shippingAddress 
    ? `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}` 
    : "-";

  const nextStatusMap: Record<string, string> = {
    'PENDING': 'PROCESSING',
    'PROCESSING': 'DISPATCHED',
    'DISPATCHED': 'DELIVERED',
  };
  const nextStatus = nextStatusMap[order.status];

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-6">
      
      {/* Back Link */}
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors w-fit">
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <PageHeader 
        title={`Order #${order.orderNumber || order.id.substring(0, 8)}`}
        action={
          <div className="flex gap-4 items-center">
            {nextStatus && (
              <button 
                onClick={() => updateStatus({ id, status: nextStatus })}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 text-sm font-semibold font-inter rounded-lg transition-colors border border-stone-200 disabled:opacity-50"
              >
                {isUpdating ? <RefreshCw size={14} className="animate-spin" /> : null}
                Mark as {nextStatus.charAt(0) + nextStatus.slice(1).toLowerCase()}
              </button>
            )}
            <OrderDispatchButtons 
              orderId={id}
              customerName={customerName}
              address={address}
              phone={customerPhone}
            />
            <OrderStatusBadge status={order.paymentStatus || "pending"} />
            <OrderStatusBadge status={order.status} />
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
              <span className="font-inter text-sm text-stone-800">{customerName}</span>
              <span className="font-inter text-sm text-stone-500">{customerPhone}</span>
              {order.customer?.email && <span className="font-inter text-sm text-stone-500">{order.customer.email}</span>}
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
                <PaymentGatewayBadge gateway={order.paymentMethod || 'COD'} status={order.paymentStatus?.toLowerCase() || 'pending'} />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm text-stone-500">Subtotal</span>
                <span className="font-inter text-sm text-stone-800">Rs. {order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm text-stone-500">Shipping</span>
                <span className="font-inter text-sm text-stone-800">Rs. {order.shippingFee?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2 border-t border-stone-100 pt-2">
                <span className="font-inter text-sm text-stone-900 font-semibold">Total</span>
                <span className="font-inter text-sm text-stone-900 font-bold">Rs. {order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm font-inter">
              <Truck size={16} className="text-stone-400" />
              Shipping
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-inter text-sm text-stone-800">Address</span>
              <p className="font-inter text-sm text-stone-500 whitespace-pre-wrap">{address}</p>
            </div>
          </div>
          
        </div>

        {/* Right Col: Items */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-stone-900 font-semibold text-sm font-inter">Order Items ({order.items?.length || 0})</h3>
            
            <div className="flex flex-col gap-4 mt-2">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-stone-100 rounded-md overflow-hidden relative">
                    <Image 
                      src={item.variant?.product?.featuredImage || "/products/default.jpg"} 
                      alt="Product"
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-inter font-medium text-sm text-stone-900">{item.variant?.product?.name || 'Unknown Product'}</span>
                    <span className="font-inter text-xs text-stone-500">Variant: {item.variant?.size} | {item.variant?.color}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-inter font-medium text-sm text-stone-900">Rs. {item.priceAtPurchase?.toLocaleString()}</span>
                    <span className="font-inter text-xs text-stone-500">Qty: {item.quantity}</span>
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
