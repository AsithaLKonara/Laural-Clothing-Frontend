"use client";

import { useState } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { PaginatedResponse } from "@/types/api";

export default function ClientContent({ initialData }: { initialData?: PaginatedResponse<Product> }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [skip, setSkip] = useState(0);
  const take = 12;

  const { data: response, isLoading } = useProducts({ skip, take }, skip === 0 ? initialData : undefined);
  const products = response?.data || [];
  const total = response?.meta.total || 0;

  const handleLoadMore = () => {
    setSkip(prev => prev + take);
  };

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-background pt-[83px]">
      
      {/* Hero Banner for Sale */}
      <div className="w-full bg-[#5E3122] py-20 px-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] mix-blend-overlay"></div>
        <h1 className="font-poppins font-semibold text-5xl md:text-6xl text-background leading-tight mb-4 relative z-10 tracking-tight">
          End of Season Sale
        </h1>
        <p className="font-poppins text-base md:text-lg text-background/90 max-w-[600px] relative z-10">
          Up to 50% off selected luxury pieces. Limited time only.
        </p>
      </div>

      {/* Tool Bar */}
      <div className="w-full bg-background border-b border-[#44403B]/10">
        <div className="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto h-[54px] px-[20px] md:px-[120px]">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sale" }]} />
          
          <span className="font-urbanist text-sm text-primary text-right">
            Showing {products.length > 0 ? skip + 1 : 0}–{Math.min(skip + take, total)} of {total} results
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
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex justify-center w-full">
                  <div className="w-full max-w-[245px] h-[380px] bg-stone-100 animate-pulse rounded-lg"></div>
                </div>
              ))
            ) : products.map((product: Product) => (
              <div key={product.id} className="flex justify-center w-full animate-in fade-in zoom-in-95 duration-300 delay-[100ms]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {skip + take < total && (
            <div className="flex justify-center w-full mt-12 mb-8">
              <button onClick={handleLoadMore} className="h-[52px] px-10 flex justify-center items-center border border-primary hover:bg-primary hover:text-background text-primary transition-colors rounded-full font-poppins font-semibold text-sm uppercase tracking-widest">
                Load More
              </button>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
