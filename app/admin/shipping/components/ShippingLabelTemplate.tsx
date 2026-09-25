import React from 'react';
import Image from 'next/image';

export default function ShippingLabelTemplate({ order, index, total, storeName, storeAddress, storePhone }: { order: any; index?: number; total?: number; storeName?: string; storeAddress?: string; storePhone?: string; }) {
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
  const codAmount = order.paymentMethod?.toUpperCase() === 'COD' ? order.total : 0;

  return (
    <div className="w-[384px] h-[576px] overflow-hidden border-2 border-black p-4 bg-white font-mono text-sm relative print:w-[4in] print:h-[6in] print:border-none print:m-0 print:p-4 print:overflow-hidden mx-auto flex flex-col">
      <div className="absolute top-4 right-4 font-bold text-lg tracking-widest z-10">FARDAR</div>
      
      <div className="border-b-2 border-black pb-3 mb-4 flex items-center">
        <Image src="/images/logo.png" alt="Seramaaduwen Logo" width={200} height={40} className="object-contain" />
      </div>

      {/* Addresses Section (Side by Side) */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Sender (From) Section */}
        <div className="text-xs">
          <h2 className="font-bold border-b border-gray-300 mb-1 uppercase text-[10px] text-gray-600">From:</h2>
          <p className="font-bold whitespace-pre-wrap">{storeName || 'SERAMAADUWEN.LK Ltd.'}</p>
          <p className="whitespace-pre-wrap">{storeAddress || '123 Fashion Avenue\nColombo 07'}</p>
          <p className="mt-1 font-bold text-[10px]">Tel: {storePhone || '+94 11 234 5678'}</p>
        </div>

        {/* Receiver (To) Section */}
        <div>
          <h2 className="font-bold border-b border-black mb-1 uppercase text-xs">Deliver To:</h2>
          <p className="font-bold uppercase text-sm leading-tight mb-1">{customerName}</p>
          <p className="text-xs leading-tight">{customerAddress}</p>
          <p className="text-xs leading-tight">{city}</p>
          <p className="mt-1 font-bold text-xs">Tel: {customerPhone}</p>
        </div>
      </div>

      <div className="border-t-2 border-black pt-3 mb-3 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] uppercase text-gray-500 font-bold">Order Ref:</p>
          <p className="font-bold">{order.orderNumber}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-gray-500 font-bold">Date:</p>
          <p>{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="col-span-2 mt-1">
          <p className="text-[10px] uppercase text-gray-500 font-bold">Tracking Number:</p>
          <p className="font-bold text-xl tracking-widest">{order.trackingNumber || 'PENDING'}</p>
        </div>
      </div>

      {/* Items Section */}
      <div className="border-t border-dashed border-gray-400 pt-3 mb-4 flex-grow">
        <h2 className="font-bold uppercase text-[10px] text-gray-500 mb-2">Order Items:</h2>
        <div className="flex flex-col gap-1 text-xs">
          {order.items && order.items.length > 0 ? (
            order.items.map((item: any, i: number) => {
              const productName = item.variant?.product?.name || item.productName || 'Unknown Item';
              const color = item.variant?.color ? ` | ${item.variant.color}` : '';
              const size = item.variant?.size ? ` | ${item.variant.size}` : '';
              return (
                <div key={i} className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="truncate pr-2">{productName}{color}{size}</span>
                  <span className="font-bold whitespace-nowrap">x{item.quantity}</span>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 italic">No item details available</p>
          )}
        </div>
      </div>

      <div className="border-2 border-black p-3 bg-gray-50 flex items-center justify-between mt-auto">
        <p className="font-bold uppercase tracking-wider text-base">
          {codAmount > 0 ? 'CASH ON DELIVERY' : 'PREPAID'}
        </p>
        <p className="font-bold text-2xl">
          {codAmount > 0 ? `Rs. ${codAmount.toFixed(2)}` : 'PAID'}
        </p>
      </div>

      {order.trackingNumber && (
        <div className="border-2 border-black p-4 bg-white flex flex-col items-center justify-center mt-3">
          <img 
            src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${order.trackingNumber}&scaleX=2&scaleY=1.5`} 
            alt="Barcode" 
            className="w-[80%] h-16 object-contain"
          />
          <p className="mt-1 font-bold text-sm tracking-widest">{order.trackingNumber}</p>
        </div>
      )}
      
      <div className="mt-4 text-center text-xs text-gray-500 italic print:hidden">
        {total ? `Label ${index} of ${total}` : 'Preview'}
      </div>

      {/* This ensures proper page breaks when printing multiple labels */}
      <div className="hidden print:block print:break-after-page"></div>
    </div>
  );
}
