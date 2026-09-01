import { serverFetch } from "@/lib/server-fetch";
import { notFound } from "next/navigation";
import Image from "next/image";
import PrintButton from "./PrintButton";

export default async function LabelPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = await params;
  const orderRes = await serverFetch<any>(`/orders/${resolvedParams.orderId}`, {
    next: { revalidate: 0 },
  }).catch(() => null);

  if (!orderRes || !orderRes.data) {
    return notFound();
  }

  const order = orderRes.data;
  
  if (!order.trackingNumber) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 font-inter">
        <h1 className="text-2xl font-bold text-stone-800">No Tracking Number</h1>
        <p className="text-stone-500 mt-2">This order has not been dispatched yet.</p>
      </div>
    );
  }

  const customerName = order.customer 
    ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`
    : order.shippingAddress?.firstName 
      ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
      : 'Guest';

  const customerPhone = order.customer?.phone || order.shippingAddress?.phone || 'N/A';
  const customerAddress = order.shippingAddress 
    ? `${order.shippingAddress.addressLine1} ${order.shippingAddress.addressLine2 || ''}`
    : 'No shipping address provided';
  const city = order.shippingAddress?.city || 'Unknown City';

  const codAmount = order.paymentMethod === 'COD' ? order.total : 0;

  return (
    <div className="bg-white min-h-screen flex flex-col items-center py-8">
      {/* Print Button (hidden when printing) */}
      <div className="w-full max-w-[400px] flex justify-end mb-4 print:hidden">
        <PrintButton />
      </div>

      {/* Printable Label Area */}
      <div className="w-[400px] border-2 border-black p-4 bg-white font-mono text-sm relative">
        <div className="absolute top-4 right-4 font-bold text-lg">FARDAR</div>
        
        <div className="border-b-2 border-black pb-4 mb-4">
          <h1 className="text-xl font-bold mb-1">SHIPPING LABEL</h1>
          <p className="text-xs uppercase">Laural Clothing Ltd.</p>
        </div>

        <div className="mb-4">
          <h2 className="font-bold border-b border-gray-300 mb-2 uppercase text-xs">Deliver To:</h2>
          <p className="font-bold text-lg">{customerName}</p>
          <p>{customerAddress}</p>
          <p>{city}</p>
          <p className="mt-1 font-bold">Tel: {customerPhone}</p>
        </div>

        <div className="border-t-2 border-black pt-4 mb-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase text-gray-500">Order Ref:</p>
            <p className="font-bold">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500">Date:</p>
            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs uppercase text-gray-500">Tracking Number:</p>
            <p className="font-bold text-lg">{order.trackingNumber}</p>
          </div>
        </div>

        <div className="border-2 border-black p-3 bg-gray-100 flex items-center justify-between">
          <p className="font-bold uppercase tracking-wider">
            {codAmount > 0 ? 'CASH ON DELIVERY' : 'PREPAID'}
          </p>
          <p className="font-bold text-xl">
            {codAmount > 0 ? `Rs. ${codAmount.toFixed(2)}` : 'PAID'}
          </p>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500 italic">
          Please do not fold on barcode area.
        </div>
      </div>
    </div>
  );
}
