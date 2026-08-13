"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid, Info, ArrowLeftRight, Heart, Ruler, Send, MessageCircle } from "lucide-react";
import CategoryBar from "@/components/CategoryBar";
import ProductGallery from "@/components/ProductGallery";
import ProductTabs from "@/components/ProductTabs";
import SizeGuideModal from "@/components/SizeGuideModal";
import ProductCard from "@/components/ProductCard";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 3000, stopOnInteraction: true })]
  );
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedColor, setSelectedColor] = useState("pink");

  const images = [
    "/hero-image/hero-1.jpg",
    "/hero-image/hero-2.jpg",
    "/hero-image/hero-3.jpg",
    "/hero-image/hero-1.jpg",
  ];

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-background pt-[83px]">
      
      {/* Sub Navbar */}
      <CategoryBar />

      {/* Breadcrumbs */}
      <div className="w-full max-w-[1280px] mx-auto py-6 px-4 md:px-[120px] flex justify-between items-center">
        <span className="font-urbanist text-sm text-[#79716B]">
          Home / Dresses / <span className="text-primary font-semibold">Era Dress - Yellow</span>
        </span>
        <div className="hidden md:flex gap-4 text-primary">
          <button className="hover:text-stone-500"><ChevronLeft size={18} strokeWidth={1.5} /></button>
          <button className="hover:text-stone-500"><LayoutGrid size={18} strokeWidth={1.5} /></button>
          <button className="hover:text-stone-500"><ChevronRight size={18} strokeWidth={1.5} /></button>
        </div>
      </div>

      {/* Top Section: Gallery & Info */}
      <div className="flex flex-col lg:flex-row w-full max-w-[1280px] mx-auto px-4 md:px-[120px] gap-8 md:gap-[60px] pb-10 md:pb-[60px]">
        
        {/* Left: Gallery */}
        <div className="flex-shrink-0 flex justify-center lg:justify-start w-full lg:w-auto">
          <ProductGallery images={images} />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col flex-1 w-full gap-[24px]">
          
          {/* Header & Pricing */}
          <div className="flex flex-col gap-2 pb-2">
            <h1 className="font-poppins text-3xl md:text-[36px] font-normal text-primary leading-tight">
              Era Dress – Yellow
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="font-poppins text-[22px] md:text-[26px] font-bold text-primary">Rs 2,790.00</span>
            </div>
          </div>

          {/* Installments */}
          <div className="flex flex-col gap-3 w-full border-b border-stone-200 pb-8">
            <div className="flex items-center text-base text-[#79716B] font-poppins">
              <span>3 X Rs. 930.00 with</span>
              <div className="w-[50px] h-[20px] bg-[#0E1E2B] rounded-full mx-2 flex items-center justify-center text-[10px] text-white font-bold tracking-widest">MINTPAY</div>
              <Info size={14} className="text-primary" fill="currentColor" color="white" />
            </div>
            <div className="flex items-center text-base text-[#79716B] font-poppins">
              <span>or 3 X Rs 930.00 with</span>
              <div className="w-[40px] h-[16px] mx-2 flex items-center justify-center text-[11px] text-[#0033cc] font-black italic">KOKO</div>
              <Info size={14} className="text-primary" fill="currentColor" color="white" />
            </div>
            <div className="flex items-center text-base text-[#79716B] font-poppins">
              <span>or up to 4 X Rs 697.50 with</span>
              <div className="w-[50px] h-[20px] mx-2 flex items-center justify-center text-xs text-[#00aaff] font-black italic tracking-tighter">Payzy</div>
              <Info size={14} className="text-primary" fill="currentColor" color="white" />
            </div>
          </div>

          {/* Selections */}
          <div className="flex flex-col gap-4 mt-2">
            
            {/* Size Select */}
            <div className="flex items-center gap-4">
              <span className="font-poppins font-bold text-base text-primary">Size :</span>
              <div className="flex gap-3">
                {['UK 08', 'UK 10', 'UK 12', 'UK 14'].map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-[34px] px-4 rounded-full flex items-center justify-center font-poppins text-sm transition-colors border ${
                      selectedSize === size 
                        ? 'border-primary text-primary' 
                        : 'border-stone-200 text-primary hover:border-stone-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row items-center gap-4 w-full mt-4 pb-6 border-b border-stone-200">
            {/* Qty Selector */}
            <div className="flex items-center border border-stone-300 rounded-sm h-[44px] w-[110px] flex-shrink-0">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex-1 text-lg text-[#79716B] border-r border-stone-300 h-full hover:bg-stone-50">-</button>
              <span className="flex-1 font-poppins text-sm text-primary flex items-center justify-center h-full">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="flex-1 text-lg text-[#79716B] border-l border-stone-300 h-full hover:bg-stone-50">+</button>
            </div>
            
            {/* Add to Cart */}
            <button className="h-[44px] px-8 rounded-sm bg-primary font-poppins font-semibold text-sm text-white hover:bg-stone-800 transition-colors uppercase tracking-wide">
              Add to Cart
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center gap-6 pb-6">
            <button className="flex items-center gap-2 font-poppins font-medium text-sm text-primary hover:text-accent transition-colors">
              <ArrowLeftRight size={18} strokeWidth={1.5} /> Compare
            </button>
            <button className="flex items-center gap-2 font-poppins font-medium text-sm text-primary hover:text-accent transition-colors">
              <Heart size={18} strokeWidth={1.5} /> Add to wishlist
            </button>
            <button onClick={() => setIsSizeGuideOpen(true)} className="flex items-center gap-2 font-poppins font-medium text-sm text-primary hover:text-accent transition-colors">
              <Ruler size={18} strokeWidth={1.5} /> Size Guide
            </button>
          </div>
          
          <div className="w-full h-[1px] bg-stone-200 mb-2"></div>

          {/* Meta Data */}
          <div className="flex flex-col gap-4 font-poppins text-sm text-primary">
            <p><span className="font-bold">SKU:</span> <span className="text-[#79716B]">N/A</span></p>
            <p><span className="font-bold">Categories:</span> <span className="text-[#79716B]">Dresses , July 01 , july Dresses , New arrivals</span></p>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-bold">Share:</span>
              <div className="flex gap-4 text-stone-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="cursor-pointer hover:text-primary"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="cursor-pointer hover:text-primary"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="cursor-pointer hover:text-primary"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                <Send size={16} fill="currentColor" className="cursor-pointer hover:text-primary" />
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Tabs Section */}
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[120px]">
        <ProductTabs />
      </div>

      {/* Related Products */}
      <div className="flex flex-col items-center w-full max-w-[1280px] mx-auto px-4 md:px-[120px] py-16 md:py-[80px]">
        <h2 className="font-poppins text-2xl md:text-4xl text-primary mb-8">Related Products</h2>
        <div className="w-full max-w-[1040px] overflow-hidden" ref={emblaRef}>
          <div className="flex gap-[20px]">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="flex-[0_0_245px] min-w-[245px]">
                <ProductCard />
              </div>
            ))}
          </div>
        </div>
        <Link href="/shop" className="font-poppins text-base text-primary border-b border-primary mt-8 pb-1">
          Explore more
        </Link>
      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

      {/* Floating WhatsApp Widget */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 z-50">
        <div className="bg-white border border-stone-200 shadow-md rounded-full px-4 py-2 flex items-center justify-center font-poppins text-sm text-primary">
          Contact us
        </div>
        <button className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
          <MessageCircle size={32} color="white" />
        </button>
      </div>
    </main>
  );
}
