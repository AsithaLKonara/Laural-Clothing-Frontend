"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, Check } from "lucide-react";

interface FilterSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function FilterSidebar({ isOpen = true, onToggle }: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    colors: true,
    size: true,
    style: true,
  });

  const [selectedColor, setSelectedColor] = useState<string>("blue");
  const [selectedSize, setSelectedSize] = useState<string>("Large");

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const categories = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];
  const styles = ["Casual", "Formal", "Party", "Gym"];
  
  const colors = [
    { id: "blue", hex: "#063AF5" },
    { id: "purple", hex: "#7D06F5" },
    { id: "pink", hex: "#F506A4" },
    { id: "white", hex: "#FAFAF9", border: true },
    { id: "black", hex: "#1C1917" }
  ];

  const sizes = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"];

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
        <h2 className="font-poppins font-bold text-xl text-primary">Filters</h2>
        <button 
          onClick={onToggle}
          className="p-2 -mr-2 rounded-full hover:bg-stone-200 transition-colors"
          title="Hide Filters"
        >
          <SlidersHorizontal size={24} className="text-primary" />
        </button>
      </div>

      <div className="w-full h-[1px] bg-[#44403B]/20" />

      {/* Search */}
      <div className="flex flex-col w-full gap-[12px]">
        <h3 className="font-poppins font-bold text-base text-primary">Search</h3>
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
        {categories.map((cat) => (
          <div key={cat} className="flex justify-between items-center cursor-pointer group">
            <span className="font-poppins text-base text-[#44403B] group-hover:text-primary transition-colors">{cat}</span>
            <ChevronDown size={16} className="text-[#44403B] -rotate-90 group-hover:text-primary transition-transform" />
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
