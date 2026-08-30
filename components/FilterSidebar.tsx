"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, Check, Filter } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useProductFilters } from "@/hooks/useProducts";
import Link from 'next/link';

interface FilterSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function FilterSidebar({ isOpen = true, onToggle }: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    colors: true,
    size: true,
    style: true,
  });

  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [selectedSize, setSelectedSize] = useState<string>("S");

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const { data: response, isLoading } = useCategories();
  const categories = response?.data || [];
  
  const { data: filters } = useProductFilters();
  
  const styles = ["Casual", "Formal", "Party", "Gym"];
  
  // Use dynamic colors if available, mapping strings to basic objects
  const colors = filters?.colors
    ?.filter((color: string) => !color.includes(',') && isNaN(Number(color)))
    ?.slice(0, 10)
    ?.map((color: string) => ({
      id: color,
      hex: color.toLowerCase().replace(' ', ''), // basic fallback to CSS color names
      border: color.toLowerCase() === "white" || color.toLowerCase() === "off white"
    })) || [];

  const sizes = ["S", "M", "L", "UK 08", "UK 10", "UK 12"];

  if (!isOpen) {
    return (
      <div className="flex flex-col items-center w-full h-full bg-[#FAFAF9] border-r border-stone-200 py-[20px] shadow-sm">
        <button 
          onClick={onToggle}
          className="p-3 rounded-full hover:bg-stone-200 transition-colors"
          title="Show Filters"
        >
          <SlidersHorizontal size={20} className="text-[#1C1917]" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#FAFAF9] border-r border-stone-200 py-[20px] px-[20px] md:pl-[40px] md:pr-[20px] gap-[24px] overflow-y-auto no-scrollbar shadow-sm">
      
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <h2 className="font-poppins font-bold text-xl text-primary flex items-center gap-2">
          <Filter size={20} /> Filters
        </h2>
        <button 
          onClick={onToggle}
          className="p-2 -mr-2 rounded-full hover:bg-stone-200 transition-colors"
          title="Hide Filters"
        >
          <SlidersHorizontal size={20} className="text-[#1C1917]" />
        </button>
      </div>

      <div className="w-full h-[1px] bg-[#44403B]/20" />

      {/* Search */}
      <div className="flex flex-col w-full gap-[12px]">
        <h3 className="font-poppins font-bold text-xl text-primary">Search</h3>
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full h-[40px] px-[16px] bg-[#E7E5E4] rounded-full font-urbanist font-light text-sm text-primary placeholder:text-[#44403B] focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#44403B]/20" />

      {/* Categories */}
      <div className="flex flex-col w-full gap-[20px]">
        {categories.map((cat: any) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`} className="flex justify-between items-center cursor-pointer group">
            <span className="font-poppins text-base text-[#44403B] group-hover:text-primary transition-colors">{cat.name}</span>
            <ChevronDown size={16} className="text-[#44403B] -rotate-90 group-hover:text-primary transition-transform" />
          </Link>
        ))}
      </div>

      <div className="w-full h-[1px] bg-[#44403B]/20" />

      {/* Price */}
      <div className="flex flex-col w-full gap-[20px]">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("price")}
        >
          <h3 className="font-poppins font-bold text-xl text-primary">Price</h3>
          {openSections.price ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-primary" />}
        </div>
        
        {openSections.price && (
          <div className="flex flex-col gap-[16px] w-full px-2">
            {/* Visual slider mock */}
            <div className="relative w-full h-[6px] bg-[#44403B] rounded-full mt-2">
              <div className="absolute left-[20%] right-[30%] h-full bg-primary rounded-full" />
              <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-[20px] h-[20px] bg-primary rounded-full shadow-md cursor-grab" />
              <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-[20px] h-[20px] bg-primary rounded-full shadow-md cursor-grab" />
            </div>
            <div className="flex justify-between items-center w-full mt-2">
              <span className="font-poppins font-medium text-sm text-primary">Rs. 50</span>
              <span className="font-poppins font-medium text-sm text-primary">Rs. 200</span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full h-[1px] bg-[#44403B]/20" />

      {/* Colors */}
      <div className="flex flex-col w-full gap-[20px]">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("colors")}
        >
          <h3 className="font-poppins font-bold text-xl text-primary">Colors</h3>
          {openSections.colors ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-primary" />}
        </div>
        
        {openSections.colors && (
          <div className="flex flex-wrap gap-[16px] w-full">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                className={`relative w-[37px] h-[37px] rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                  color.border ? "border border-[#79716B]" : ""
                } ${selectedColor === color.id ? "ring-2 ring-offset-2 ring-[#79716B]" : ""}`}
                style={{ backgroundColor: color.hex }}
              >
                {selectedColor === color.id && (
                  <Check size={16} className={color.id === "white" ? "text-black" : "text-white"} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full h-[1px] bg-[#44403B]/20" />

      {/* Size */}
      <div className="flex flex-col w-full gap-[20px]">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("size")}
        >
          <h3 className="font-poppins font-bold text-xl text-primary">Size</h3>
          {openSections.size ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-primary" />}
        </div>
        
        {openSections.size && (
          <div className="flex flex-wrap gap-[8px] w-full">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex justify-center items-center px-[20px] py-[10px] rounded-[62px] transition-colors ${
                  selectedSize === size
                    ? "bg-primary text-background"
                    : "bg-[#D6D3D1] text-[#44403B] hover:bg-[#c9c5c3]"
                }`}
              >
                <span className={`font-poppins text-sm ${selectedSize === size ? "font-medium" : "font-normal"}`}>
                  {size}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full h-[1px] bg-[#44403B]/20" />

      {/* Dress Style */}
      <div className="flex flex-col w-full gap-[20px]">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("style")}
        >
          <h3 className="font-poppins font-bold text-xl text-primary">Dress Style</h3>
          {openSections.style ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-primary" />}
        </div>
        
        {openSections.style && (
          <div className="flex flex-col w-full gap-[20px]">
            {styles.map((style) => (
              <div key={style} className="flex justify-between items-center cursor-pointer group">
                <span className="font-poppins text-base text-[#44403B] group-hover:text-primary transition-colors">{style}</span>
                <ChevronDown size={16} className="text-[#44403B] -rotate-90 group-hover:text-primary transition-transform" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Filter Button */}
      <button className="w-full h-[48px] bg-primary text-background rounded-[62px] font-poppins font-medium text-sm hover:bg-[#2c2824] transition-colors mt-[10px] mb-[20px]">
        Apply Filter
      </button>

    </div>
  );
}
