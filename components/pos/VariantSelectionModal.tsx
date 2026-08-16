"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function VariantSelectionModal({ product, onClose }: { product: any, onClose: () => void }) {
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-[500px] bg-background shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border bg-surface">
          <h3 className="font-inter font-bold text-lg text-foreground">Select Options</h3>
          <button onClick={onClose} className="p-2 text-muted hover:text-foreground hover:bg-background rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          
          {/* Product Summary */}
          <div className="flex gap-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-border">
              <Image src={product.image || "/products/default.jpg"} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="font-inter font-bold text-foreground leading-snug">{product.name}</h4>
              <span className="font-inter font-bold text-primary mt-1 text-lg">Rs. {product.price}</span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-border"></div>

          {/* Color Selection */}
          <div className="flex flex-col gap-3">
            <label className="font-inter font-semibold text-sm text-foreground">Color: {selectedColor}</label>
            <div className="flex gap-3">
              {[
                { name: 'Black', hex: '#111827' },
                { name: 'White', hex: '#FFFFFF' },
                { name: 'Navy', hex: '#1E3A8A' }
              ].map(color => (
                <button 
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-[40px] h-[40px] rounded-full border-2 transition-all ${
                    selectedColor === color.name ? 'border-primary scale-110' : 'border-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="flex flex-col gap-3">
            <label className="font-inter font-semibold text-sm text-foreground">Size: {selectedSize}</label>
            <div className="flex gap-2 flex-wrap">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-[40px] min-w-[50px] px-4 rounded-lg flex items-center justify-center font-inter font-semibold text-sm transition-colors border ${
                    selectedSize === size 
                      ? 'border-primary text-primary bg-primary-soft' 
                      : 'border-border text-foreground hover:border-muted bg-surface'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-3">
            <label className="font-inter font-semibold text-sm text-foreground">Quantity</label>
            <div className="flex items-center border border-border rounded-lg h-[44px] w-[140px] bg-surface overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex-1 text-lg text-muted border-r border-border h-full hover:bg-background">-</button>
              <span className="flex-1 font-inter font-bold text-primary flex items-center justify-center h-full bg-background">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="flex-1 text-lg text-muted border-l border-border h-full hover:bg-background">+</button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2 rounded-lg font-inter font-semibold text-sm text-foreground hover:bg-background border border-border transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="px-8 py-2 rounded-lg font-inter font-bold text-sm text-white bg-primary hover:bg-primary-hover transition-colors shadow-md">
            Add to Order
          </button>
        </div>

      </div>
    </div>
  );
}
