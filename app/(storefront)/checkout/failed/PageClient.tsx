"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { paymentService } from "@/services/payment.service";

export default function CheckoutFailedClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderNumber");

  const [selectedMethod, setSelectedMethod] = useState("mintpay");
  const [isRetrying, setIsRetrying] = useState(false);

  if (!orderNumber) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-2xl font-bold mb-4">No Order Specified</h1>
        <Link href="/" className="text-primary underline">Return to Home</Link>
      </div>
    );
  }

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const response = await paymentService.retryPayment(orderNumber, selectedMethod);
      if (response.success && response.payment) {
        if (selectedMethod === "cod" || !response.payment.redirectUrl) {
          router.push(`/checkout/success?orderNumber=${orderNumber}`);
        } else {
          window.location.href = response.payment.redirectUrl;
        }
      } else {
        alert("Could not initiate retry. Please contact support.");
        setIsRetrying(false);
      }
    } catch (error) {
      console.error("Retry failed:", error);
      alert("Something went wrong. Please try again.");
      setIsRetrying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-24">
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 md:p-12">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-center text-stone-800 mb-2">Payment Failed</h1>
        <p className="text-stone-500 text-center mb-8">
          We couldn't process the payment for Order <span className="font-semibold text-stone-700">#{orderNumber}</span>.
          Don't worry, your order is saved. You can try again using a different payment method below.
        </p>

        <div className="max-w-md mx-auto space-y-4 mb-8">
          <h2 className="font-semibold text-stone-800 mb-4">Select an alternative payment method:</h2>
          
          <label className={`flex flex-col p-4 cursor-pointer hover:bg-stone-50 transition-colors border rounded-xl ${selectedMethod === 'mintpay' ? 'border-primary bg-stone-50/50' : 'border-stone-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${selectedMethod === 'mintpay' ? 'border-primary bg-primary' : 'border-stone-300 bg-white'}`}>
                {selectedMethod === 'mintpay' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <input type="radio" value="mintpay" checked={selectedMethod === 'mintpay'} onChange={() => setSelectedMethod('mintpay')} className="hidden" />
              <div className="font-semibold text-stone-800">Mintpay</div>
            </div>
          </label>

          <label className={`flex flex-col p-4 cursor-pointer hover:bg-stone-50 transition-colors border rounded-xl ${selectedMethod === 'koko' ? 'border-primary bg-stone-50/50' : 'border-stone-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${selectedMethod === 'koko' ? 'border-primary bg-primary' : 'border-stone-300 bg-white'}`}>
                {selectedMethod === 'koko' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <input type="radio" value="koko" checked={selectedMethod === 'koko'} onChange={() => setSelectedMethod('koko')} className="hidden" />
              <div className="font-semibold text-stone-800">Koko</div>
            </div>
          </label>

          <label className={`flex flex-col p-4 cursor-pointer hover:bg-stone-50 transition-colors border rounded-xl ${selectedMethod === 'cod' ? 'border-primary bg-stone-50/50' : 'border-stone-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${selectedMethod === 'cod' ? 'border-primary bg-primary' : 'border-stone-300 bg-white'}`}>
                {selectedMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <input type="radio" value="cod" checked={selectedMethod === 'cod'} onChange={() => setSelectedMethod('cod')} className="hidden" />
              <div>
                <div className="font-semibold text-stone-800">Cash on Delivery (COD)</div>
                <div className="text-sm text-stone-500">Pay when you receive your order</div>
              </div>
            </div>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="px-8 py-3 rounded-full font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition text-center">
            Return Home
          </Link>
          <button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="px-8 py-3 rounded-full font-medium text-white bg-primary hover:bg-primary/90 transition disabled:opacity-50 text-center"
          >
            {isRetrying ? "Processing..." : "Retry Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
