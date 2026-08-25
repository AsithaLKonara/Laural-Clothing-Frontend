"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, Check, Filter, X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useProductFiltersMeta } from "@/hooks/useProducts";
import colorNames from "color-name";

interface FilterState {
  search?: string;
  category?: string;
  sizes: string[];
  colors: string[];
  minPrice?: number;
  maxPrice?: number;
  styles: string[];
  sort?: string;
}

interface FilterSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  initialFilters?: Partial<FilterState>;
  onApplyFilters?: (filters: FilterState) => void;
}

export default function FilterSidebar({ isOpen = true, onToggle, initialFilters, onApplyFilters }: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    colors: true,
    size: true,
    style: true,
  });

  const [filters, setFilters] = useState<FilterState>({
    search: initialFilters?.search || "",
    category: initialFilters?.category || "",
    sizes: initialFilters?.sizes || [],
    colors: initialFilters?.colors || [],
    minPrice: initialFilters?.minPrice,
    maxPrice: initialFilters?.maxPrice,
    styles: initialFilters?.styles || [],
    sort: initialFilters?.sort || "",
  });

  useEffect(() => {
    if (initialFilters) {
      setFilters({
        search: initialFilters.search || "",
        category: initialFilters.category || "",
        sizes: initialFilters.sizes || [],
        colors: initialFilters.colors || [],
        minPrice: initialFilters.minPrice,
        maxPrice: initialFilters.maxPrice,
        styles: initialFilters.styles || [],
        sort: initialFilters.sort || "",
      });
    }
  }, [initialFilters]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const { data: response, isLoading } = useCategories();
  const categories = response?.data || [];
  
  const { data: filtersMeta } = useProductFiltersMeta();
  const sizesList = filtersMeta?.sizes || [];
  const dynamicColors = filtersMeta?.colors || [];
  
  const stylesList = ["Casual", "Formal", "Party", "Gym", "Vintage", "Minimalist"];
  
  const getColorStyle = (colorName: string) => {
    if (!colorName) return 'transparent';
    const normalized = colorName.toLowerCase().replace(/[^a-z]/g, '');
    
    if (normalized in colorNames) {
      const [r, g, b] = colorNames[normalized as keyof typeof colorNames];
      return `rgb(${r}, ${g}, ${b})`;
    }

    let bestMatch = '';
    for (const known of Object.keys(colorNames)) {
      if (normalized.includes(known) && known.length > bestMatch.length) {
        bestMatch = known;
      }
    }
    
    if (bestMatch) {
      const [r, g, b] = colorNames[bestMatch as keyof typeof colorNames];
      return `rgb(${r}, ${g}, ${b})`;
    }

    return colorName.toLowerCase().trim();
  };

  const toggleArrayItem = (key: 'sizes' | 'colors' | 'styles', value: string) => {
    setFilters(prev => {
      const array = prev[key];
      if (array.includes(value)) {
        return { ...prev, [key]: array.filter(i => i !== value) };
      } else {
        return { ...prev, [key]: [...array, value] };
      }
    });
  };

  const clearFilters = () => {
    const empty = { search: "", category: "", sizes: [], colors: [], minPrice: undefined, maxPrice: undefined, styles: [], sort: "" };
    setFilters(empty);
    if (onApplyFilters) onApplyFilters(empty);
  };

  if (!isOpen) {
    return (
      <div className="flex flex-col items-center w-full h-full bg-background border-r border-[#44403B]/20 py-[20px]">
        <button 
          onClick={onToggle}
          className="p-3 rounded-full hover:bg-stone-200 transition-colors"
          title="Show Filters"
        >
          <SlidersHorizontal size={24} className="text-primary" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-background border-r border-[#44403B]/20 py-[20px] px-[20px] md:pl-[60px] md:pr-[20px] gap-[24px]">
      
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <h2 className="font-poppins font-bold text-xl text-primary flex items-center gap-2">
          <Filter size={20} /> Filters
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={clearFilters} className="text-sm font-urbanist text-primary underline hover:text-[#5E3122]">Clear</button>
          <button 
            onClick={onToggle}
            className="p-2 -mr-2 rounded-full hover:bg-stone-200 transition-colors"
            title="Hide Filters"
          >
            <X size={20} className="text-primary" />
          </button>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#44403B]/20" />

      {/* Search */}
      <div className="flex flex-col w-full gap-[12px]">
        <h3 className="font-poppins font-bold text-base text-primary">Search</h3>
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full h-[40px] px-[16px] bg-[#E7E5E4] rounded-full font-urbanist font-light text-sm text-primary placeholder:text-[#44403B] focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => { if (e.key === 'Enter' && onApplyFilters) onApplyFilters(filters) }}
          />
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#44403B]/20" />

      {/* Categories */}
      <div className="flex flex-col w-full gap-[20px]">
        {categories.map((cat: any) => (
          <div 
            key={cat.id} 
            className={`flex justify-between items-center cursor-pointer group ${filters.category === cat.slug ? 'font-bold' : ''}`}
            onClick={() => setFilters({ ...filters, category: filters.category === cat.slug ? "" : cat.slug })}
          >
            <span className={`font-poppins text-base group-hover:text-primary transition-colors ${filters.category === cat.slug ? 'text-primary' : 'text-[#44403B]'}`}>
              {cat.name}
            </span>
            {filters.category === cat.slug ? (
              <Check size={16} className="text-primary" />
            ) : (
              <ChevronDown size={16} className="text-[#44403B] -rotate-90 group-hover:text-primary transition-transform" />
            )}
          </div>
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
          <div className="flex flex-col gap-[16px] w-full px-1">
            <div className="flex items-center gap-2 w-full">
              <input 
                type="number"
                placeholder={`Min (e.g. ${filtersMeta?.minPrice ?? 0})`}
                value={filters.minPrice || ""}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full h-[40px] px-3 bg-stone-100 rounded-md font-urbanist text-sm border border-stone-200 focus:outline-none focus:border-primary"
              />
              <span className="text-stone-400">-</span>
              <input 
                type="number"
                placeholder={`Max (e.g. ${filtersMeta?.maxPrice ?? 10000})`}
                value={filters.maxPrice || ""}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full h-[40px] px-3 bg-stone-100 rounded-md font-urbanist text-sm border border-stone-200 focus:outline-none focus:border-primary"
              />
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
            {dynamicColors.map((color: string) => {
              const isSelected = filters.colors.includes(color);
              const hexStyle = getColorStyle(color);
              const isWhite = hexStyle.toLowerCase() === "#fafaf9" || hexStyle.toLowerCase() === "white";
              
              return (
                <button
                  key={color}
                  onClick={() => toggleArrayItem('colors', color)}
                  className={`relative w-[37px] h-[37px] rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                    isWhite ? "border border-[#79716B]" : "border border-stone-200"
                  } ${isSelected ? "ring-2 ring-offset-2 ring-[#79716B]" : ""}`}
                  style={{ backgroundColor: hexStyle }}
                  title={color}
                >
                  {isSelected && (
                    <Check size={16} className={isWhite ? "text-black" : "text-white"} />
                  )}
                </button>
              );
            })}
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
            {sizesList.map((size) => {
              const isSelected = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleArrayItem('sizes', size)}
                  className={`flex justify-center items-center px-[20px] py-[10px] rounded-[62px] transition-colors ${
                    isSelected
                      ? "bg-primary text-background"
                      : "bg-[#D6D3D1] text-[#44403B] hover:bg-[#c9c5c3]"
                  }`}
                >
                  <span className={`font-poppins text-sm ${isSelected ? "font-medium" : "font-normal"}`}>
                    {size}
                  </span>
                </button>
              );
            })}
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
          <div className="flex flex-col w-full gap-[12px]">
            {stylesList.map((style) => {
              const isSelected = filters.styles.includes(style);
              return (
                <label key={style} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleArrayItem('styles', style)}
                    className="w-[18px] h-[18px] rounded-sm text-primary accent-primary cursor-pointer border-stone-300"
                  />
                  <span className={`font-poppins text-base transition-colors ${isSelected ? "text-primary font-medium" : "text-[#44403B] group-hover:text-primary"}`}>
                    {style}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply Filter Button */}
      <div className="sticky bottom-0 pb-4 pt-2 bg-background mt-4 w-full">
        <button 
          onClick={() => onApplyFilters && onApplyFilters(filters)}
          className="w-full h-[48px] bg-primary text-background rounded-[62px] font-poppins font-medium text-sm hover:bg-[#2c2824] transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
