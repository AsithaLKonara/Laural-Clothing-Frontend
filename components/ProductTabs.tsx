"use client";

import { useState } from "react";
import ReviewCard from "./ReviewCard";

type TabName = "Product Details" | "Rating & Reviews" | "FAQs";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState<TabName>("Product Details");

  const tabs: TabName[] = ["Product Details", "Rating & Reviews", "FAQs"];

  return (
    <div className="flex flex-col w-full mt-[80px]">
      
      {/* Tabs Header */}
      <div className="flex flex-row justify-center md:justify-center items-center w-full border-b border-stone-200 overflow-x-auto no-scrollbar gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-4 font-poppins text-[16px] md:text-[20px] transition-all ${
              activeTab === tab 
                ? "text-[#1C1917] font-medium border-b-2 border-[#1C1917]" 
                : "text-[#79716B] font-normal border-b-2 border-transparent hover:text-[#1C1917]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="flex flex-col w-full py-[40px]">
        {activeTab === "Product Details" && (
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto animate-in fade-in duration-500">
            <h3 className="font-poppins font-semibold text-[24px] text-[#1C1917] mb-4">Exceptional Craftsmanship</h3>
            <p className="font-poppins font-light text-[16px] leading-[1.8] text-stone-600 mb-6">
              Our Vesper Long Sleeve Top is designed for both elegance and supreme comfort. Woven from a proprietary blend of sustainably sourced cotton and elastane, it provides a tailored fit that breathes beautifully throughout the day.
            </p>
            <ul className="text-left font-poppins font-light text-[16px] leading-[1.8] text-stone-600 list-disc pl-6 space-y-2">
              <li>95% Organic Cotton, 5% Elastane</li>
              <li>Machine wash cold, tumble dry low</li>
              <li>Ribbed cuffs and subtle neckline detailing</li>
              <li>Ethically manufactured in Sri Lanka</li>
            </ul>
          </div>
        )}

        {activeTab === "Rating & Reviews" && (
          <div className="flex flex-col w-full animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
              <ReviewCard 
                name="Alex M." 
                rating={5} 
                text="The top exceeded my expectations! The colors are vibrant and the print quality is top-notch."
                date="August 15, 2026"
              />
              <ReviewCard 
                name="Sarah J." 
                rating={4} 
                text="Very comfortable and fits perfectly. Lost one star because shipping took a bit longer than expected."
                date="August 10, 2026"
              />
              <ReviewCard 
                name="Emily R." 
                rating={5} 
                text="Absolutely love the material. It feels so premium and washes well without shrinking."
                date="August 2, 2026"
              />
            </div>
            
            <div className="flex justify-center w-full mt-[40px]">
              <button className="border-b border-[#1C1917] pb-1 font-poppins text-[16px] text-[#1C1917]">
                Load More Reviews
              </button>
            </div>
          </div>
        )}

        {activeTab === "FAQs" && (
          <div className="flex flex-col max-w-[800px] mx-auto w-full gap-6 animate-in fade-in duration-500">
            <div className="border-b border-stone-200 pb-4">
              <h4 className="font-poppins font-medium text-[18px] text-[#1C1917] mb-2">How long does shipping take?</h4>
              <p className="font-poppins font-light text-[15px] text-stone-600">
                Standard shipping takes 3-5 business days within Sri Lanka. International shipping can take up to 14 days.
              </p>
            </div>
            <div className="border-b border-stone-200 pb-4">
              <h4 className="font-poppins font-medium text-[18px] text-[#1C1917] mb-2">What is your return policy?</h4>
              <p className="font-poppins font-light text-[15px] text-stone-600">
                We accept returns within 14 days of delivery. Items must be unworn and in their original packaging.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
