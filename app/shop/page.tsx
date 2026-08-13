"use client";

import { useState } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import CategoryBar from "@/components/CategoryBar";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

export default function ShopPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-[#FAFAF9] pt-[83px]">
      
      {/* Sub Navbar */}
      <CategoryBar />

      {/* Breadcrumbs & Tool Bar */}
      <div className="w-full bg-[#FAFAF9] border-b border-[#44403B]/10">
        <div className="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto h-[54px] px-[20px] md:px-[120px]">
          
          <span className="font-urbanist text-[14px] text-[#1C1917] underline decoration-1 underline-offset-4 cursor-pointer hover:text-[#5E3122]">
            Home / Shop
          </span>
          
          <span className="font-urbanist text-[14px] text-[#1C1917] text-right">
            Showing 1–12 of 597 results
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
              <div key={i} className="flex justify-center w-full">
                <ProductCard />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-row justify-center items-center w-full mt-[60px] mb-[40px] gap-[8px]">
            <button className="flex justify-center items-center w-[40px] h-[40px] rounded-full border border-[#D6D3D1] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FAFAF9] transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="flex justify-center items-center w-[40px] h-[40px] rounded-full bg-[#1C1917] text-[#FAFAF9] font-poppins font-medium text-[14px]">
              1
            </button>
            <button className="flex justify-center items-center w-[40px] h-[40px] rounded-full text-[#1C1917] font-poppins font-medium text-[14px] hover:bg-[#D6D3D1] transition-colors">
              2
            </button>
            <button className="flex justify-center items-center w-[40px] h-[40px] rounded-full text-[#1C1917] font-poppins font-medium text-[14px] hover:bg-[#D6D3D1] transition-colors">
              3
            </button>
            <span className="flex justify-center items-center w-[40px] h-[40px] text-[#1C1917] font-poppins font-medium text-[14px]">
              ...
            </span>
            <button className="flex justify-center items-center w-[40px] h-[40px] rounded-full text-[#1C1917] font-poppins font-medium text-[14px] hover:bg-[#D6D3D1] transition-colors">
              10
            </button>
            <button className="flex justify-center items-center w-[40px] h-[40px] rounded-full border border-[#D6D3D1] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FAFAF9] transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
