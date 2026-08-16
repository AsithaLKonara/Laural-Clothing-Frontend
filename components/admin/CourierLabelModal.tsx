"use client";

import React from "react";
import { Printer, X } from "lucide-react";

interface CourierLabelModalProps {
  orders: {
    id: string;
    customer: string;
    address: string;
    phone: string;
    itemsCount: number;
    weight: string;
  }[];
  onClose: () => void;
}

export default function CourierLabelModal({ orders, onClose }: CourierLabelModalProps) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:bg-white print:p-0">
      
      {/* Modal Container - Hidden when printing */}
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col print:hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <div>
            <h2 className="font-inter font-bold text-lg text-stone-900">Print Courier Labels</h2>
            <p className="font-inter text-sm text-stone-500">Ready to print {orders.length} labels</p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-stone-100 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 flex flex-col gap-2 relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-stone-50 border-l border-b border-stone-200 rounded-bl-lg rounded-tr-lg flex items-center justify-center">
                   {/* Dummy QR Code */}
                   <div className="w-10 h-10 bg-stone-900" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)', backgroundSize: '4px 4px', backgroundPosition: '0 0, 2px 2px' }}></div>
                </div>
                <h3 className="font-inter font-bold text-lg text-stone-900 border-b border-stone-100 pb-2 mb-1 w-[80%]">Order {order.id}</h3>
                
                <div className="flex flex-col gap-1">
                  <span className="font-inter font-bold text-sm text-stone-900">{order.customer}</span>
                  <span className="font-inter text-xs text-stone-600 leading-relaxed max-w-[85%]">{order.address}</span>
                  <span className="font-inter font-medium text-xs text-stone-900 mt-1">Tel: {order.phone}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-stone-100 flex justify-between items-center font-inter text-xs text-stone-500">
                  <span>{order.itemsCount} Items</span>
                  <span>Weight: {order.weight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-stone-200 text-stone-700 font-inter font-medium text-sm rounded-lg hover:bg-stone-50 transition-colors shadow-sm">
            Cancel
          </button>
          <button onClick={handlePrint} className="px-6 py-2 bg-stone-900 text-white font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors shadow-sm flex items-center gap-2">
            <Printer size={16} /> Print All ({orders.length})
          </button>
        </div>
      </div>

      {/* Print View - Only visible when printing. Usually printed on 4x6 thermal labels */}
      <div className="hidden print:flex flex-col gap-8 w-full">
        {orders.map((order) => (
          <div key={order.id} className="flex flex-col w-[4in] h-[6in] p-[0.25in] border-2 border-black break-after-page bg-white text-black relative">
            <div className="border-b-4 border-black pb-4 mb-4 flex justify-between items-start">
              <h1 className="font-sans font-black text-4xl">LAURAL</h1>
              <div className="text-right">
                <p className="font-mono font-bold text-xl">{order.id}</p>
                <p className="font-sans text-sm font-bold uppercase mt-1">Standard Delivery</p>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-sans font-bold text-sm uppercase tracking-widest text-gray-500">Ship To</span>
                <span className="font-sans font-bold text-2xl leading-none">{order.customer}</span>
                <span className="font-sans text-xl leading-snug">{order.address}</span>
                <span className="font-sans font-bold text-xl mt-2">{order.phone}</span>
              </div>
            </div>

            <div className="border-t-4 border-black pt-4 mt-auto grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="font-sans font-bold text-xs uppercase text-gray-500">Weight</span>
                <span className="font-sans font-bold text-xl">{order.weight}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-xs uppercase text-gray-500">Pieces</span>
                <span className="font-sans font-bold text-xl">{order.itemsCount}</span>
              </div>
            </div>

            {/* Dummy Barcode at bottom */}
            <div className="w-full h-24 mt-6 flex items-stretch justify-center gap-[2px]">
              <div className="w-1 bg-black"></div>
              <div className="w-2 bg-black"></div>
              <div className="w-3 bg-black"></div>
              <div className="w-[1px] bg-black"></div>
              <div className="w-1.5 bg-black"></div>
              <div className="w-2.5 bg-black"></div>
              <div className="w-3 bg-black"></div>
              <div className="w-[2px] bg-black"></div>
              <div className="w-1 bg-black"></div>
              <div className="w-4 bg-black"></div>
              <div className="w-1 bg-black"></div>
              <div className="w-[3px] bg-black"></div>
              <div className="w-1 bg-black"></div>
              <div className="w-1.5 bg-black"></div>
              <div className="w-2 bg-black"></div>
              <div className="w-1 bg-black"></div>
              <div className="w-[2px] bg-black"></div>
              <div className="w-1.5 bg-black"></div>
              <div className="w-3 bg-black"></div>
              <div className="w-1 bg-black"></div>
              <div className="w-2 bg-black"></div>
              <div className="w-1 bg-black"></div>
              <div className="w-4 bg-black"></div>
              <div className="w-1 bg-black"></div>
            </div>
            <p className="font-mono text-center mt-2 tracking-widest font-bold text-lg">{order.id}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
