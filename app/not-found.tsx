import React from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-background px-4 text-center">
      <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-6 animate-in zoom-in-95 duration-500">
        <AlertTriangle size={40} />
      </div>
      
      <h1 className="font-poppins font-semibold text-5xl md:text-6xl text-primary leading-tight mb-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
        404
      </h1>
      
      <h2 className="font-poppins font-medium text-xl md:text-2xl text-primary mb-4 animate-in slide-in-from-bottom-5 fade-in duration-500">
        Page Not Found
      </h2>
      
      <p className="font-poppins text-sm text-stone-500 max-w-[400px] mb-8 animate-in slide-in-from-bottom-6 fade-in duration-500">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link 
        href="/shop"
        className="h-[54px] px-10 flex justify-center items-center bg-primary hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest animate-in slide-in-from-bottom-7 fade-in duration-500"
      >
        Return to Shop
      </Link>
    </main>
  );
}
