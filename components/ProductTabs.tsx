"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import ReviewCard from "./ReviewCard";

type TabName = "Product Details" | "Rating & Reviews" | "FAQs";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState<TabName>("Product Details");
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  const tabs: TabName[] = ["Product Details", "Rating & Reviews", "FAQs"];

  return (
    <div className="flex flex-col w-full mt-[80px]">
      
      {/* Tabs Header */}
      <div className="flex flex-row justify-center md:justify-center items-center w-full border-b border-stone-200 overflow-x-auto no-scrollbar gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-4 font-poppins text-base md:text-xl transition-all ${
              activeTab === tab 
                ? "text-primary font-medium border-b-2 border-primary" 
                : "text-[#79716B] font-normal border-b-2 border-transparent hover:text-primary"
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
            <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">Exceptional Craftsmanship</h3>
            <p className="font-poppins font-light text-base leading-[1.8] text-stone-600 mb-6">
              Our Vesper Long Sleeve Top is designed for both elegance and supreme comfort. Woven from a proprietary blend of sustainably sourced cotton and elastane, it provides a tailored fit that breathes beautifully throughout the day.
            </p>
            <ul className="text-left font-poppins font-light text-base leading-[1.8] text-stone-600 list-disc pl-6 space-y-2">
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
              <button className="border-b border-primary pb-1 font-poppins text-base text-primary">
                Load More Reviews
              </button>
            </div>

            {/* Interactive Review Form */}
            <div className="flex flex-col items-center w-full max-w-[600px] mx-auto mt-16 pt-10 border-t border-stone-200">
              <h3 className="font-poppins font-medium text-2xl text-primary mb-6">Write a Review</h3>
              
              {isReviewSubmitted ? (
                <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl flex flex-col items-center gap-3 w-full text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-2">
                    <Star size={24} fill="currentColor" />
                  </div>
                  <h4 className="font-poppins font-medium text-lg text-primary">Thank you for your feedback!</h4>
                  <p className="font-poppins text-stone-600 text-sm">Your review has been submitted and is awaiting moderation.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 w-full">
                  <div className="flex flex-col items-center gap-2">
                    <label className="font-poppins text-sm text-stone-600">Rate this product</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className={`transition-colors ${
                            star <= (hoverRating || rating) ? "text-accent" : "text-stone-300"
                          }`}
                        >
                          <Star size={32} fill="currentColor" stroke="none" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label className="font-poppins text-sm text-stone-600 text-left">Your review</label>
                    <textarea 
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="What did you like or dislike?"
                      className="w-full p-4 border border-stone-200 rounded-xl bg-white font-poppins text-sm text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none placeholder:text-stone-400"
                    />
                  </div>

                  <button 
                    onClick={() => {
                      if (rating > 0 && reviewText.length > 0) setIsReviewSubmitted(true);
                    }}
                    disabled={rating === 0 || reviewText.length === 0}
                    className="w-full h-[52px] flex justify-center items-center bg-primary hover:bg-stone-800 disabled:bg-stone-300 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest mt-2"
                  >
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "FAQs" && (
          <div className="flex flex-col max-w-[800px] mx-auto w-full gap-6 animate-in fade-in duration-500">
            <div className="border-b border-stone-200 pb-4">
              <h4 className="font-poppins font-medium text-lg text-primary mb-2">How long does shipping take?</h4>
              <p className="font-poppins font-light text-sm text-stone-600">
                Standard shipping takes 3-5 business days within Sri Lanka. International shipping can take up to 14 days.
              </p>
            </div>
            <div className="border-b border-stone-200 pb-4">
              <h4 className="font-poppins font-medium text-lg text-primary mb-2">What is your return policy?</h4>
              <p className="font-poppins font-light text-sm text-stone-600">
                We accept returns within 14 days of delivery. Items must be unworn and in their original packaging.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
