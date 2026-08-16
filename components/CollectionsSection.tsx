"use client";
import Link from "next/link";
import CategoryCard from "./CategoryCard";
import { useCollectionCategories } from "@/hooks/useCategories";

export default function CollectionsSection() {
  const { data: categories = [], isLoading } = useCollectionCategories();

  return (
    <section className="relative w-full h-auto px-4 md:px-8 lg:px-[120px] py-10 md:py-[60px] bg-background">
      <div className="relative z-10 w-full h-full flex flex-col max-w-[1280px] mx-auto">
      
      {/* Header Area */}
      <div className="flex flex-col items-center text-center mb-6 w-full">
        <span className="text-sm md:text-base font-poppins text-stone-500 block mb-2 uppercase tracking-widest">
          Shop by Category
        </span>
        <h2 className="text-3xl md:text-4xl font-signature text-stone-900 tracking-wide mb-2">
          Collections
        </h2>
        <p className="text-sm md:text-base font-inria text-stone-600 italic">
          Pieces edited for quiet luxury — cut clean, worn easy.
        </p>
      </div>

      {/* Explore More */}
      <div className="flex justify-end w-full mb-6">
        <Link 
          href="/collections" 
          className="text-sm md:text-base font-signature text-stone-900 hover:text-stone-500 transition-colors tracking-wider border-b border-stone-900 pb-0.5"
        >
          Explore more
        </Link>
      </div>

      {/* Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-[20px] w-full mt-4 md:mt-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              imageUrl={category.imageUrl}
              href={category.href}
            />
          ))}
        </div>
      
      </div>
    </section>
  );
}
