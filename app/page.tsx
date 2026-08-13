import Hero from "@/components/Hero";
import CollectionsSection from "@/components/CollectionsSection";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import AdBannerSection from "@/components/AdBannerSection";
import OfferCollectionSection from "@/components/OfferCollectionSection";
import BrandStorySection from "@/components/BrandStorySection";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Hero />
      <CollectionsSection />
      <NewArrivalsSection />
      <AdBannerSection />
      <OfferCollectionSection />
      <BrandStorySection />
    </main>
  );
}
