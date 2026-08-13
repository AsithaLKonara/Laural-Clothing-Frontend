"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import CategoryBar from "@/components/CategoryBar";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CategoryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const params = useParams();
  const slug = params.slug as string;
  
  // Format slug to readable name: "womens-tops" -> "Womens Tops"
  const categoryName = slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Category';

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-[#FAFAF9] pt-[83px]">
      
      {/* Sub Navbar */}
      <CategoryBar />

      {/* Category Header */}
      <div className="w-full bg-[#1C1917] py-12 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="font-poppins font-semibold text-[32px] md:text-[40px] text-[#FAFAF9] leading-tight mb-2">
          {categoryName}
        </h1>
        <p className="font-poppins text-[15px] text-[#FAFAF9]/70 max-w-[600px]">
          Explore our latest collection of {categoryName.toLowerCase()} designed with unparalleled craftsmanship.
        </p>
      </div>

      {/* Tool Bar */}
      <div className="w-full bg-[#FAFAF9] border-b border-[#44403B]/10">
        <div className="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto h-[54px] px-[20px] md:px-[120px]">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: categoryName }
          ]} />
          
          <span className="font-urbanist text-[14px] text-[#1C1917] text-right">
            Showing 1–12 of 145 results
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
            <button className="h-[52px] px-10 flex justify-center items-center border border-[#1C1917] hover:bg-[#1C1917] hover:text-[#FAFAF9] text-[#1C1917] transition-colors rounded-full font-poppins font-semibold text-[14px] uppercase tracking-widest">
              Load More
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
