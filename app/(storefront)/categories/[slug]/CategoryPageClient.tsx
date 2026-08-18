"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import CategoryBar from "@/components/CategoryBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";

export default function CategoryPageClient() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const params = useParams();
  const slug = params.slug as string;
  const [skip, setSkip] = useState(0);
  const take = 12;
  
  // Format slug to readable name: "womens-tops" -> "Womens Tops"
  const categoryName = slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Category';

  const { data: response, isLoading } = useProducts({ skip, take, category: slug });
  const products = response?.data || [];
  const total = response?.meta.total || 0;

  const handleLoadMore = () => {
    setSkip(prev => prev + take);
  };

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-background pt-[83px]">
      
      {/* Sub Navbar */}
      <CategoryBar />

      {/* Category Header */}
      <div className="w-full bg-primary py-12 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="font-poppins font-semibold text-4xl md:text-5xl text-background leading-tight mb-2">
          {categoryName}
        </h1>
        <p className="font-poppins text-sm text-background/70 max-w-[600px]">
          Explore our latest collection of {categoryName.toLowerCase()} designed with unparalleled craftsmanship.
        </p>
      </div>

      {/* Tool Bar */}
      <div className="w-full bg-background border-b border-[#44403B]/10">
        <div className="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto h-[54px] px-[20px] md:px-[120px]">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: categoryName }
          ]} />
          
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
              <div key={product.id} className="flex justify-center w-full animate-in fade-in zoom-in-95 duration-300">
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
