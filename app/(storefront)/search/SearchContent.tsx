"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import EmptyState from "@/components/EmptyState";
import { Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [skip, setSkip] = useState(0);
  const take = 12;

  const { data: response, isLoading } = useProducts({ search: query, skip, take });
  const products = response?.data || [];
  const total = response?.meta.total || 0;

  const hasResults = isLoading || total > 0;

  const handleLoadMore = () => {
    setSkip(prev => prev + take);
  };

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-background pt-[83px]">
      
      {/* Header */}
      <div className="w-full bg-primary py-12 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="font-poppins font-semibold text-4xl text-background leading-tight mb-2">
          Search Results
        </h1>
        <p className="font-poppins text-sm text-background/70">
          {isLoading ? `Searching for "${query}"...` : (total > 0 ? `Showing results for "${query}"` : `No results found for "${query}"`)}
        </p>
      </div>

      {/* Tool Bar */}
      <div className="w-full bg-background border-b border-[#44403B]/10">
        <div className="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto h-[54px] px-[20px] md:px-[120px]">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
          
          {hasResults && !isLoading && (
            <span className="font-urbanist text-sm text-primary text-right">
              Showing {products.length > 0 ? skip + 1 : 0}–{Math.min(skip + take, total)} of {total} results
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row w-full max-w-[1440px] mx-auto min-h-screen">
        
        {hasResults && (
          <div 
            className={`transition-all duration-500 ease-in-out flex-shrink-0 ${
              isSidebarOpen ? "w-full md:w-[365px]" : "w-full md:w-[80px]"
            }`}
          >
            <FilterSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>
        )}

        <div className={`flex-1 flex flex-col py-6 md:py-[40px] px-4 transition-all duration-500 ease-in-out ${hasResults ? 'md:px-[40px]' : 'items-center justify-center'}`}>
          
          {hasResults ? (
            <div className="w-full">
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
          ) : (
            <div className="w-full max-w-[500px]">
              <EmptyState 
                icon={Search}
                title="No results found"
                description="We couldn't find anything matching your search. Try adjusting your keywords or browse our categories."
                actionText="Continue Shopping"
                actionHref="/shop"
              />
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default function SearchContent() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
