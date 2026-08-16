"use client";

import { useState, useEffect } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import CategoryBar from "@/components/CategoryBar";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

export default function ShopContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalItems = 59; // Dummy total
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = [...Array(totalItems)].slice(startIndex, endIndex);

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
              Showing {startIndex + 1}–{endIndex} of {totalItems} results
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
            {/* Render items for current page */}
            {currentItems.map((_, i) => (
              <div key={startIndex + i} className="flex justify-center w-full animate-in fade-in zoom-in-95 duration-300">
                <ProductCard imageUrl={`/products/p${((startIndex + i) % 6) + 1}.jpg`} />
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
