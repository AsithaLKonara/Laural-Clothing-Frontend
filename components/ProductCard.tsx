"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex flex-col items-start p-[12px] gap-[8px] w-full max-w-[245px] bg-white rounded-[5px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-[221/281] bg-stone-100 flex flex-col justify-between overflow-hidden">
        
        {/* Default Image */}
        <Image
          src="/products/default.jpg"
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
        
        {/* Discount Tag */}
        <div className="absolute top-0 right-0 p-[10px] z-10">
          <div className="flex justify-center items-center px-[8px] py-[2px] bg-[#5E3122] rounded-full shadow-sm">
            <span className="font-inter font-normal text-[8px] leading-[10px] text-white">
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
                <div key={size} className="flex justify-center items-center w-[36px] h-[22px] bg-black/80 border border-white/20 rounded-full cursor-pointer hover:bg-black transition-colors">
                  <span className="font-inter font-bold text-[11px] text-white">{size}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Add to Cart Button (Always Visible) */}
          <button className="flex justify-center items-center w-full p-[10px] bg-black hover:bg-stone-900 transition-colors pointer-events-auto">
            <span className="font-inter font-bold text-[12px] leading-[15px] text-white">
              + Add to cart
            </span>
          </button>
        </div>
      </div>

      {/* Product Details Container */}
      <div className="flex flex-col items-start gap-[8px] w-[221px] mt-1">
        
        {/* Pricing & Title Block */}
        <div className="flex flex-col items-center justify-center gap-[4px] w-full">
          <h3 className="font-inter font-bold text-[11px] leading-[13px] text-black text-center">
            Vesper Long Sleeve Top – Pink
          </h3>
          
          <div className="flex items-center gap-[10px] h-[20px]">
            {/* Old Price */}
            <div className="flex items-center px-[8px] py-[2px] rounded-full">
              <span className="font-inter font-light italic text-[13px] leading-[16px] line-through text-[#5E3122]">
                Rs: 2,190
              </span>
            </div>
            {/* New Price */}
            <div className="flex items-center px-[8px] py-[2px] bg-[#F7EAE0] rounded-full">
              <span className="font-inter font-bold text-[13px] leading-[16px] text-[#5E3122]">
                Rs: 1,990
              </span>
            </div>
          </div>
        </div>

        {/* Payment Integrations */}
        <div className="flex flex-col items-center justify-center gap-[2px] w-full mt-1">
          {/* Mintpay */}
          <div className="flex items-center justify-between gap-[4px]">
            <div className="flex items-center rounded-full">
              <span className="font-inter font-normal text-[8px] leading-[10px] text-stone-600">
                3 X Rs. 730.00 with
              </span>
            </div>
            <div className="flex items-center justify-center w-[32px] h-[11px] relative">
              <Image src="/payment-methods/mintpay-pill.png" alt="mintpay" fill className="object-contain" />
            </div>
          </div>
          {/* Payzy */}
          <div className="flex items-center justify-between gap-[4px]">
            <div className="flex items-center rounded-full">
              <span className="font-inter font-normal text-[8px] leading-[10px] text-stone-600">
                4 X Rs. 547.50 with
              </span>
            </div>
            <div className="flex items-center justify-center w-[32px] h-[11px] relative">
              <Image src="/payment-methods/payzy.png" alt="payzy" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Bottom Area: Color Swatches always visible now since button moved */}
        <div className="flex justify-center items-center gap-[6px] w-full mt-2 h-[20px]">
          {['#FBBB00', '#FDFD96', '#60D66A', '#8A38F5'].map((color, i) => (
            <div 
              key={i} 
              className="w-[14px] h-[14px] rounded-full border border-stone-300 shadow-sm cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        
      </div>
    </div>
  );
}
