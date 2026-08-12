import Image from "next/image";

export default function BrandStorySection() {
  return (
    <section className="relative flex justify-center items-center px-[120px] py-[60px] w-full min-h-[630px] overflow-hidden bg-[#F5F5F4]">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/about/bg.jpg"
          alt="Brand Story Background"
          fill
          className="object-cover opacity-30" // Adding slight opacity in case it acts as a subtle background pattern, adjust as needed
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-row items-center justify-center w-full max-w-[1038px] gap-[20px]">
        
        {/* Left Image Container */}
        <div className="relative flex-1 w-full max-w-[509px] h-[509px] overflow-hidden shadow-sm">
          <Image
            src="/about/image1.jpg"
            alt="Brand Story Feature"
            fill
            className="object-cover"
          />
        </div>

        {/* Right Text Container */}
        <div className="flex flex-col justify-center items-start flex-1 w-full max-w-[509px] h-[509px] px-[40px] py-[60px] gap-[24px]">
          
          {/* Subtle Over-title */}
          <span className="font-inter uppercase tracking-[0.3em] text-[10px] text-stone-500">
            The Laural Ethos
          </span>
          
          {/* Main Headline */}
          <h2 className="font-signature font-normal text-[56px] leading-[1.1] text-left text-stone-900 -mt-2">
            your style deserves <br /> to shine
          </h2>
          
          {/* Elegant Separator Line */}
          <div className="w-[40px] h-[1px] bg-stone-400 my-2" />

          {/* Elevated Luxury Copy */}
          <div className="flex flex-col gap-4">
            <p className="font-inria italic text-[22px] leading-[1.6] text-stone-800">
              "We believe true luxury lies in effortless elegance."
            </p>
            <p className="font-inria font-light text-[17px] leading-[1.8] text-stone-600">
              Our collections are curated to elevate your everyday wardrobe, offering timeless silhouettes crafted with uncompromising quality. Discover fashion that transcends passing trends and becomes an enduring extension of your unique identity.
            </p>
          </div>
          
        </div>

      </div>
    </section>
  );
}
