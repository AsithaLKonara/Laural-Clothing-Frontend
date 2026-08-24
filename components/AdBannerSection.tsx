import Image from "next/image";

export default function AdBannerSection() {
  return (
    <section className="relative flex flex-col justify-center items-center px-4 md:px-8 lg:px-[120px] py-10 md:py-[60px] w-full h-[150px] md:h-[250px]">
      {/* Background Image */}
      <Image
        src="/Untitled-1.jpeg"
        alt="Ad Banner Background"
        fill
        className="object-cover z-0"
        priority
      />
      
      {/* Dark Overlay (60% Opacity Black) */}
      <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />

      {/* Text Content */}
      <div className="absolute inset-0 z-20 flex justify-center items-center pointer-events-none w-full h-full px-4">
        <h2 className="font-signature font-normal text-2xl md:text-5xl leading-tight text-center text-background">
          fashion is more than just clothing
        </h2>
      </div>
    </section>
  );
}
