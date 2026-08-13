import React, { useEffect, useState } from "react";
import { Check, X, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "success", isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success": return <Check size={18} className="text-emerald-500" />;
      case "error": return <AlertCircle size={18} className="text-red-500" />;
      case "info": return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-3 bg-white border border-stone-200 shadow-xl rounded-full px-5 py-3 pr-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 shrink-0">
          {getIcon()}
        </div>
        <span className="font-poppins text-sm text-primary pr-2 shrink-0">
          {message}
        </span>
        <button 
          onClick={onClose}
          className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-stone-100 text-stone-400 hover:text-primary transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
