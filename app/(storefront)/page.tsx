import Hero from "@/components/Hero";
import CollectionsSection from "@/components/CollectionsSection";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import AdBannerSection from "@/components/AdBannerSection";
import OfferCollectionSection from "@/components/OfferCollectionSection";
import BrandStorySection from "@/components/BrandStorySection";
import TestimonialSection from "@/components/TestimonialSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Hero />
      {/* Delivery Ribbon */}
      <div className="w-full bg-[#1A1A1A] py-3 flex justify-center items-center">
        <span className="font-poppins text-xs md:text-sm text-white tracking-[0.2em] uppercase font-light">
          Delivery Available Islandwide
        </span>
      </div>
      <CollectionsSection />
      <NewArrivalsSection />
      <AdBannerSection />
      <OfferCollectionSection />
      <BrandStorySection />
      <TestimonialSection />
    </main>
  );
}
