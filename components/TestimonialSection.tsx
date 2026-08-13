import React from "react";
import ReviewCard from "./ReviewCard";

export default function TestimonialSection() {
  return (
    <section className="flex flex-col items-center justify-center w-full bg-background py-20 px-4 md:px-12 lg:px-24">
      <div className="flex flex-col items-center w-full max-w-[1280px]">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 max-w-[800px]">
          <span className="font-urbanist font-medium text-sm text-accent uppercase tracking-[0.2em] mb-4">
            Customer Testimonials
          </span>
          <h2 className="font-poppins font-semibold text-4xl md:text-[42px] text-primary leading-tight mb-4">
            Loved by Thousands
          </h2>
          <p className="font-poppins text-base text-stone-600">
            Discover why our community loves Laural Clothing. Real reviews from our verified customers who have experienced the difference in quality and style.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          <ReviewCard 
            name="Natasha W." 
            rating={5} 
            text="The quality of the fabric is exceptional. I ordered three different pieces and they all fit flawlessly. Will definitely be returning for the winter collection!"
            date="August 12, 2026"
          />
          <ReviewCard 
            name="Priyanka D." 
            rating={5} 
            text="I was hesitant to order online, but the size guide was spot on. The customer service team was also incredibly helpful when I had a question about shipping."
            date="August 08, 2026"
          />
          <ReviewCard 
            name="Amila F." 
            rating={5} 
            text="Beautifully crafted garments. You can tell they pay attention to the small details, from the stitching to the luxurious unboxing experience."
            date="August 01, 2026"
          />
        </div>
        
      </div>
    </section>
  );
}
