"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  imageUrl?: string;
}

export default function ProductCard({ imageUrl = "/products/default.jpg" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <div 
      className="group flex flex-col w-full max-w-[245px] bg-white rounded-lg cursor-pointer overflow-hidden border border-stone-100 hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push("/products/vesper-long-sleeve-top")}
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-[221/281] bg-stone-100 flex flex-col justify-between overflow-hidden">
        
        {/* Default Image */}
        <Link href="/products/vesper-long-sleeve-top" className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt="Product Image"
            fill
            className={`object-cover transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
          />
          {/* Hover Image */}
          <Image
            src="/products/hover.jpg"
            alt="Product Image Hover"
            fill
            className={`object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        </Link>
        
        {/* Discount Tag */}
        <div className="absolute top-2 right-2 z-10">
          <div className="flex justify-center items-center px-2 py-1 bg-white/95 backdrop-blur-sm shadow-sm rounded">
            <span className="font-poppins font-medium text-[9px] tracking-[0.1em] text-stone-900 uppercase">
              20% off
            </span>
          </div>
        </div>
        
        {/* Bottom Overlays */}
        <div className="absolute bottom-0 w-full flex flex-col z-20 pointer-events-none">
          {/* Sizes Row (Hover Only) */}
          <div 
            className={`flex items-center justify-center h-[36px] w-full bg-black/30 backdrop-blur-sm transition-all duration-300 pointer-events-auto ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex gap-[6px]">
              {['S', 'M', 'L'].map(size => (
                <div key={size} onClick={(e) => e.stopPropagation()} className="flex justify-center items-center w-[36px] h-[22px] bg-black/80 border border-white/20 rounded-full cursor-pointer hover:bg-black transition-colors">
                  <span className="font-inter font-bold text-[11px] text-white">{size}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Add to Cart Button (Always Visible) */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic would go here
            }}
            className="flex justify-center items-center w-full py-2.5 bg-stone-900 hover:bg-black transition-colors pointer-events-auto"
          >
            <span className="font-poppins font-medium text-[11px] text-white uppercase tracking-[0.1em]">
              Add to cart
            </span>
          </button>
        </div>
      </div>

      {/* Product Details Container */}
      <div className="flex flex-col items-center gap-2 w-full p-4 pt-3">
        
        {/* Pricing & Title Block */}
        <div className="flex flex-col items-center justify-center w-full">
          <Link href="/products/vesper-long-sleeve-top" className="hover:text-stone-500 transition-colors">
            <h3 className="font-poppins font-bold text-sm text-stone-900 text-center tracking-wide mb-1.5">
              Vesper Long Sleeve Top – Pink
            </h3>
          </Link>
          
          <div className="flex items-center gap-2.5">
            {/* Old Price */}
            <span className="font-inter font-medium text-[12px] line-through text-stone-400">
              Rs. 2,190
            </span>
            {/* New Price */}
            <span className="font-inter font-black text-[14px] text-stone-900">
              Rs. 1,990
            </span>
          </div>
        </div>

        {/* Payment Integrations */}
        <div className="flex flex-col items-center justify-center w-full mt-1.5 border-t border-stone-100 pt-3">
          <div className="flex items-center gap-1.5 flex-wrap justify-center opacity-70 group-hover:opacity-100 transition-opacity">
            <span className="font-inter font-light text-[9px] text-stone-500">
              3 X Rs. 730.00 with
            </span>
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center w-[28px] h-[10px] relative">
                <Image src="/payment-methods/koko.png" alt="koko" fill className="object-contain" />
              </div>
              <div className="flex items-center justify-center w-[28px] h-[10px] relative">
                <Image src="/payment-methods/mintpay-pill.png" alt="mintpay" fill className="object-contain" />
              </div>
              <div className="flex items-center justify-center w-[28px] h-[10px] relative">
                <Image src="/payment-methods/payzy.png" alt="payzy" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Area Spacer */}
        <div className="h-[4px]"></div>
        
      </div>
    </div>
  );
}
