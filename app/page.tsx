import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CollectionsSection from "@/components/CollectionsSection";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import AdBannerSection from "@/components/AdBannerSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar />
      <Hero />
      <CollectionsSection />
      <NewArrivalsSection />
      <AdBannerSection />
    </main>
  );
}
