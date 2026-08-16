"use client";

import { useEffect } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-background px-4 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 animate-in zoom-in-95 duration-500">
        <AlertOctagon size={40} />
      </div>
      
      <h1 className="font-poppins font-semibold text-4xl md:text-5xl text-primary leading-tight mb-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
        Something went wrong
      </h1>
      
      <p className="font-poppins text-sm text-stone-500 max-w-[500px] mb-8 animate-in slide-in-from-bottom-5 fade-in duration-500">
        We apologize for the inconvenience. An unexpected error has occurred on our end. Please try again or return to the shop.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-6 fade-in duration-500">
        <button
          onClick={() => reset()}
          className="h-[54px] px-8 flex justify-center items-center gap-2 bg-primary hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
        
        <button 
          onClick={() => window.location.href = '/shop'}
          className="h-[54px] px-8 flex justify-center items-center bg-white border border-primary text-primary hover:bg-stone-100 transition-colors rounded-full font-poppins font-semibold text-sm uppercase tracking-widest"
        >
          Return to Shop
        </button>
      </div>
    </main>
  );
}
