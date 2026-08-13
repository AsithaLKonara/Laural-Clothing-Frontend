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

        <h2 className="font-signature text-4xl text-primary mb-6">Size Guide</h2>
        
        <div className="w-full overflow-x-auto">
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
        
        <p className="font-poppins text-stone-500 text-xs mt-6 italic">
          * Note: Measurements are for reference only. Fit may vary depending on the style.
        </p>

      </div>
    </div>,
    document.body
  );
}
