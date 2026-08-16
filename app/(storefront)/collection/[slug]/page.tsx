"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";

export default function CollectionPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const params = useParams();
  const slug = params.slug as string;
  
  const collectionName = slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Collection';

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-background pt-[83px]">
      
      {/* Editorial Hero Banner for Collection */}
      <div className="relative w-full h-[400px] md:h-[500px] flex flex-col items-center justify-center text-center overflow-hidden">
        <Image 
          src="/hero_image_3.jpg" 
          alt={collectionName} 
          fill 
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex flex-col items-center px-4">
          <span className="font-urbanist font-medium text-sm text-white uppercase tracking-[0.3em] mb-4">
            Curated Collection
          </span>
          <h1 className="font-poppins font-semibold text-5xl md:text-6xl text-white leading-tight mb-4">
            {collectionName}
          </h1>
          <p className="font-poppins text-base text-white/90 max-w-[600px]">
            Discover the narrative behind our most exclusive pieces, designed to elevate your everyday wardrobe.
          </p>
        </div>
      </div>

      {/* Tool Bar */}
      <div className="w-full bg-background border-b border-[#44403B]/10">
        <div className="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto h-[54px] px-[20px] md:px-[120px]">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/shop" },
            { label: collectionName }
          ]} />
          
          <span className="font-urbanist text-sm text-primary text-right">
            Showing 1–12 of 32 results
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row w-full max-w-[1440px] mx-auto min-h-screen">
        
        {/* Sidebar Container */}
        <div 
          className={`transition-all duration-500 ease-in-out flex-shrink-0 ${
            isSidebarOpen ? "w-full md:w-[365px]" : "w-full md:w-[80px]"
          }`}
        >
          <FilterSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Product Grid Area */}
        <div className="flex-1 flex flex-col items-center md:items-start py-6 md:py-[40px] px-4 md:px-[40px] transition-all duration-500 ease-in-out">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-[30px] w-full max-w-max mx-auto md:mx-0">
            {/* Generate 12 dummy products */}
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex justify-center w-full animate-in fade-in zoom-in-95 duration-300">
                <ProductCard />
              </div>
            ))}
          </div>

          <div className="flex justify-center w-full mt-12 mb-8">
            <button className="h-[52px] px-10 flex justify-center items-center border border-primary hover:bg-primary hover:text-background text-primary transition-colors rounded-full font-poppins font-semibold text-sm uppercase tracking-widest">
              Load More
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
