import Link from "next/link";
import ProductCard from "./ProductCard";

export default function NewArrivalsSection() {
  return (
    <section className="flex flex-col items-center bg-[#FAFAF9] px-4 md:px-8 lg:px-[120px] py-10 md:py-[60px] w-full">
      
      {/* Header Container */}
      <div className="flex flex-col items-center justify-center w-full max-w-[1038px] mb-8">
        <h2 className="font-signature font-normal text-[28px] md:text-[32px] leading-tight md:leading-[45px] text-center text-[#1C1917]">
          New Arrivals
        </h2>
        <p className="font-inria italic font-normal text-[16px] md:text-[20px] leading-snug md:leading-[24px] text-center text-[#1C1917] mt-2">
          Timeless silhouettes. Refined details. Effortless confidence.
        </p>
      </div>

      {/* Explore More Link */}
      <div className="flex justify-end items-center w-full max-w-[1038px]">
        <Link 
          href="/new-arrivals" 
          className="flex items-center justify-center gap-[10px] pb-1 border-b border-[#1C1917]"
        >
          <span className="font-signature font-normal text-[14px] md:text-[16px] leading-[22px] text-[#1C1917]">
            Explore more
          </span>
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] py-8 md:py-[60px] w-full max-w-[1040px] place-items-center">
        {/* We'll render 8 product cards to show the grid wrap */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="w-full flex justify-center">
            <ProductCard />
          </div>
        ))}
      </div>
      
    </section>
  );
}
