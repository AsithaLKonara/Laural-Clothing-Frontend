"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"Measurements" | "Visual Guide">("Measurements");

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-[600px] bg-background shadow-2xl rounded-sm p-6 md:p-8 animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="font-signature text-4xl text-primary mb-4">Size Guide</h2>
        
        {/* Tabs */}
        <div className="flex gap-6 border-b border-stone-200 mb-6">
          {(["Measurements", "Visual Guide"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-poppins text-sm transition-all ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary font-medium"
                  : "border-b-2 border-transparent text-stone-500 hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {activeTab === "Measurements" ? (
          <div className="w-full overflow-x-auto animate-in fade-in duration-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-800 text-stone-900 font-urbanist font-bold text-sm uppercase tracking-wider">
                <th className="py-4 pr-4">Size</th>
                <th className="py-4 px-4">Chest (in)</th>
                <th className="py-4 px-4">Waist (in)</th>
                <th className="py-4 px-4">Hips (in)</th>
              </tr>
            </thead>
            <tbody className="font-poppins text-sm text-stone-700">
              <tr className="border-b border-stone-200">
                <td className="py-4 pr-4 font-bold">Small (S)</td>
                <td className="py-4 px-4">34 - 36</td>
                <td className="py-4 px-4">28 - 30</td>
                <td className="py-4 px-4">36 - 38</td>
              </tr>
              <tr className="border-b border-stone-200">
                <td className="py-4 pr-4 font-bold">Medium (M)</td>
                <td className="py-4 px-4">38 - 40</td>
                <td className="py-4 px-4">32 - 34</td>
                <td className="py-4 px-4">40 - 42</td>
              </tr>
              <tr className="border-b border-stone-200">
                <td className="py-4 pr-4 font-bold">Large (L)</td>
                <td className="py-4 px-4">42 - 44</td>
                <td className="py-4 px-4">36 - 38</td>
                <td className="py-4 px-4">44 - 46</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold">X-Large (XL)</td>
                <td className="py-4 px-4">46 - 48</td>
                <td className="py-4 px-4">40 - 42</td>
                <td className="py-4 px-4">48 - 50</td>
              </tr>
            </tbody>
          </table>
        </div>
        ) : (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
            <div className="w-full aspect-[4/3] bg-stone-100 rounded-lg flex items-center justify-center border border-stone-200 p-4">
              <div className="text-stone-400 font-poppins text-sm flex flex-col items-center gap-2">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                <span>Visual sizing chart goes here</span>
              </div>
            </div>
            <p className="font-poppins text-stone-500 text-xs mt-4 italic text-center">
              Use this visual guide to understand where to measure your body for the perfect fit.
            </p>
          </div>
        )}
        
        <p className="font-poppins text-stone-500 text-xs mt-6 italic">
          * Note: Measurements are for reference only. Fit may vary depending on the style.
        </p>

      </div>
    </div>,
    document.body
  );
}
