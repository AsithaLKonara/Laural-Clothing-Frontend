"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CategoryBar from "@/components/CategoryBar";
import ProductGallery from "@/components/ProductGallery";
import ProductTabs from "@/components/ProductTabs";
import SizeGuideModal from "@/components/SizeGuideModal";
import ProductCard from "@/components/ProductCard";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function ProductPage({ params }: { params: { slug: string } }) {
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
    <main className="relative flex flex-col w-full min-h-screen bg-[#FAFAF9] pt-[83px]">
      
      {/* Sub Navbar */}
      <CategoryBar />

      {/* Breadcrumbs */}
      <div className="w-full max-w-[1280px] mx-auto py-4 px-4 md:px-[120px]">
        <span className="font-urbanist text-[14px] text-[#1C1917] hover:text-[#5E3122] transition-colors cursor-pointer">
          Home / Shop / Tops / Vesper Long Sleeve Top
        </span>
      </div>

      {/* Top Section: Gallery & Info */}
      <div className="flex flex-col lg:flex-row w-full max-w-[1280px] mx-auto px-4 md:px-[120px] gap-8 md:gap-[60px] pb-10 md:pb-[60px]">
        
        {/* Left: Gallery */}
        <div className="flex-shrink-0 flex justify-center lg:justify-start w-full lg:w-auto">
          <ProductGallery images={images} />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col flex-1 w-full gap-[30px]">
          
          {/* Header & Pricing */}
          <div className="flex flex-col gap-2 border-b border-stone-200 pb-6">
            <h1 className="font-poppins text-[28px] md:text-[32px] font-normal text-[#1C1917] leading-tight">
              Vesper Long Sleeve Top – Pink
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="font-poppins text-[20px] md:text-[24px] line-through text-[#79716B]">Rs: 2,300</span>
              <span className="font-poppins text-[20px] md:text-[24px] font-bold text-[#1C1917]">Rs: 2,260</span>
            </div>
            <p className="font-poppins text-[15px] md:text-[16px] leading-[1.4] text-[#79716B] mt-4 max-w-[557px]">
              This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
            </p>
          </div>

          {/* Installments */}
          <div className="flex flex-col gap-2 w-full max-w-[206px]">
            <div className="flex items-center justify-between text-[14px] text-[#1C1917] px-4 py-1 rounded-full border border-stone-200">
              <span>3 X Rs. 730.00 with</span>
              <div className="w-[40px] h-[16px] bg-stone-300 rounded-sm ml-2 flex items-center justify-center text-[8px] font-bold">MINT</div>
            </div>
            <div className="flex items-center justify-between text-[14px] text-[#1C1917] px-4 py-1 rounded-full border border-stone-200">
              <span>4 X Rs. 547.50 with</span>
              <div className="w-[40px] h-[16px] bg-stone-300 rounded-sm ml-2 flex items-center justify-center text-[8px] font-bold">PAYZY</div>
            </div>
          </div>

          {/* Selections */}
          <div className="flex flex-col md:flex-row gap-10 border-b border-stone-200 pb-8">
            
            {/* Color Select */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-poppins text-[16px] text-[#44403B]">Select Colors</span>
              </div>
              <div className="flex gap-4">
                {['pink', 'black', 'white'].map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-[#1C1917] ring-2 ring-white/50' : 'border-transparent'}`}
                    style={{ backgroundColor: color === 'pink' ? '#FFC0CB' : color === 'black' ? '#1C1917' : '#F5F5F4' }}
                  />
                ))}
              </div>
            </div>

            {/* Size Select */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-poppins text-[16px] text-[#44403B]">Select Size</span>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="font-poppins text-[14px] text-[#44403B] hover:text-black underline underline-offset-2"
                >
                  Size Guide &gt;
                </button>
              </div>
              <div className="flex gap-3">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[40px] h-[40px] px-3 rounded-full flex items-center justify-center font-poppins text-[14px] transition-colors ${
                      selectedSize === size 
                        ? 'bg-[#1C1917] text-white font-medium' 
                        : 'bg-[#D6D3D1] text-[#1C1917] hover:bg-[#c2beb9]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-[500px]">
            {/* Qty Selector */}
            <div className="flex items-center justify-between bg-[#D6D3D1] rounded-full px-4 h-[44px] w-[120px] flex-shrink-0">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-[18px] text-[#1C1917] font-medium">-</button>
              <span className="font-poppins font-medium text-[16px] text-[#1C1917]">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="text-[18px] text-[#1C1917] font-medium">+</button>
            </div>
            
            {/* Add to Cart */}
            <button className="flex-1 w-full h-[44px] rounded-full border border-[#79716B] font-poppins font-medium text-[15px] text-[#1C1917] hover:bg-stone-100 transition-colors">
              Add to Cart
            </button>
            
            {/* Buy Now */}
            <button className="flex-1 w-full h-[44px] rounded-full bg-[#1C1917] font-poppins font-bold text-[15px] text-[#FAFAF9] hover:bg-stone-800 transition-colors">
              Buy Now
            </button>
          </div>
          
        </div>
      </div>

      {/* Tabs Section */}
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[120px]">
        <ProductTabs />
      </div>

      {/* Related Products */}
      <div className="flex flex-col items-center w-full max-w-[1280px] mx-auto px-4 md:px-[120px] py-16 md:py-[80px]">
        <h2 className="font-poppins text-[24px] md:text-[32px] text-[#1C1917] mb-8">Related Products</h2>
        <div className="w-full max-w-[1040px] overflow-hidden" ref={emblaRef}>
          <div className="flex gap-[20px]">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="flex-[0_0_245px] min-w-[245px]">
                <ProductCard />
              </div>
            ))}
          </div>
        </div>
        <Link href="/shop" className="font-poppins text-[16px] text-[#1C1917] border-b border-[#1C1917] mt-8 pb-1">
          Explore more
        </Link>
      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </main>
  );
}
