"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import CategoryBar from "@/components/CategoryBar";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { PaginatedResponse } from "@/types/api";

export default function ShopContent({ initialData }: { initialData?: PaginatedResponse<Product> }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const color = searchParams.get("color") || undefined;
  const size = searchParams.get("size") || undefined;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;

  // Pagination logic
  const skip = (currentPage - 1) * itemsPerPage;
  const filters = { skip, take: itemsPerPage, search, color, size, minPrice, maxPrice };
  const hasFilters = search || color || size || minPrice !== undefined || maxPrice !== undefined;
  
  const { data: response, isLoading } = useProducts(filters, (skip === 0 && !hasFilters) ? initialData : undefined);
  
  const products = response?.data || [];
  const totalItems = response?.meta.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const endIndex = Math.min(skip + itemsPerPage, totalItems);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-background pt-[83px]">
      <h1 className="sr-only">Shop All Products</h1>
      
      {/* Sub Navbar */}
      <CategoryBar />

      {/* Breadcrumbs & Tool Bar */}
      <div className="w-full bg-background border-b border-[#44403B]/10">
        <div className="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto h-[54px] px-[20px] md:px-[120px]">
          
          <span className="font-urbanist text-sm text-primary underline decoration-1 underline-offset-4 cursor-pointer hover:text-[#5E3122]">
            Home / Shop
          </span>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:block font-urbanist text-sm text-primary text-right">
              Showing {totalItems > 0 ? skip + 1 : 0}–{endIndex} of {totalItems} results
            </span>
            <button 
              className="md:hidden flex items-center gap-2 font-urbanist text-sm text-primary"
              onClick={() => setIsSidebarOpen(true)}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row w-full max-w-[1440px] mx-auto min-h-screen relative">
        
        {/* Mobile Filter Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden top-[83px]"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar Container */}
        <div 
          className={`transition-all duration-500 ease-in-out flex-shrink-0 fixed inset-y-0 left-0 top-[83px] z-40 md:relative md:top-0 md:z-0 bg-background overflow-y-auto h-[calc(100vh-83px)] md:h-auto ${
            isSidebarOpen 
              ? "w-[300px] md:w-[365px] translate-x-0" 
              : "w-[300px] md:w-[80px] -translate-x-full md:translate-x-0"
          }`}
        >
          <FilterSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Product Grid Area */}
        <div className="flex-1 flex flex-col items-center md:items-start py-6 md:py-[40px] px-4 md:px-[40px] transition-all duration-500 ease-in-out">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-[30px] w-full max-w-max mx-auto md:mx-0">
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, i) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-row justify-center items-center w-full mt-[60px] mb-[40px] gap-[8px]">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex justify-center items-center w-[40px] h-[40px] rounded-full border border-[#D6D3D1] text-primary hover:bg-primary hover:text-background disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              {getPageNumbers().map((page, index) => (
                <button 
                  key={index}
                  onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                  disabled={typeof page !== 'number'}
                  className={`flex justify-center items-center w-[40px] h-[40px] rounded-full font-poppins font-medium text-sm transition-colors ${
                    currentPage === page 
                      ? "bg-primary text-background" 
                      : typeof page === 'number' 
                        ? "text-primary hover:bg-[#D6D3D1]" 
                        : "text-primary cursor-default"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex justify-center items-center w-[40px] h-[40px] rounded-full border border-[#D6D3D1] text-primary hover:bg-primary hover:text-background disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
