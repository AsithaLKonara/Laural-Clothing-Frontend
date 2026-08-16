"use client";

import React, { useState } from "react";
import { Truck, Printer } from "lucide-react";
import FardarDispatchModal from "./FardarDispatchModal";
import CourierLabelModal from "./CourierLabelModal";

interface OrderDispatchButtonsProps {
  orderId: string;
  customerName: string;
  address: string;
  phone: string;
}

export default function OrderDispatchButtons({ orderId, customerName, address, phone }: OrderDispatchButtonsProps) {
  const [showFardarModal, setShowFardarModal] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <button 
          onClick={() => setShowLabelModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-100 text-stone-900 text-sm font-semibold font-inter rounded-lg transition-colors border border-stone-200"
        >
          <Printer size={14} /> Print Label
        </button>

        <button 
          onClick={() => setShowFardarModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold font-inter rounded-lg transition-colors shadow-sm"
        >
          <Truck size={14} /> Dispatch via Fardar
        </button>
      </div>

      {showFardarModal && (
        <FardarDispatchModal 
          orderIds={[orderId]}
          onClose={() => setShowFardarModal(false)}
          onSuccess={() => setShowFardarModal(false)}
        />
      )}

      {showLabelModal && (
        <CourierLabelModal 
          orders={[{
            id: orderId,
            customer: customerName,
            address: address,
            phone: phone,
            itemsCount: 1,
            weight: "Standard"
          }]}
          onClose={() => setShowLabelModal(false)}
        />
      )}
    </>
  );
}
