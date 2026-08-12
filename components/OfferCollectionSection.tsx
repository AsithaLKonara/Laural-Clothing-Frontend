"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import ProductCard from "./ProductCard";

export default function OfferCollectionSection() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 3000, stopOnInteraction: true })]
  );

  return (
    <section className="flex flex-col items-center bg-[#FAFAF9] px-[120px] py-[60px] w-full">
      
      {/* Header Container */}
      <div className="flex flex-col items-center justify-center w-full max-w-[1038px] mb-8">
        <h2 className="font-signature font-normal text-[32px] leading-[45px] text-center text-[#1C1917] uppercase">
          Offer Collection
        </h2>
        <p className="font-inria italic font-normal text-[20px] leading-[24px] text-center text-[#1C1917] mt-2">
          Timeless silhouettes. Refined details. Effortless confidence.
        </p>
      </div>

      {/* Explore More Link */}
      <div className="flex justify-end items-center w-full max-w-[1038px] mb-[60px]">
        <Link 
          href="/offer-collection" 
          className="flex items-center justify-center gap-[10px] pb-1 border-b border-[#1C1917]"
        >
          <span className="font-signature font-normal text-[16px] leading-[22px] text-[#1C1917]">
            Explore more
          </span>
        </Link>
      </div>

      {/* Product Carousel */}
      <div className="w-full max-w-[1040px] overflow-hidden" ref={emblaRef}>
        <div className="flex gap-[20px]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="flex-[0_0_245px] min-w-[245px]">
              <ProductCard />
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
}
