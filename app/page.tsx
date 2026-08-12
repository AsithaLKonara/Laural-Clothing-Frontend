import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CollectionsSection from "@/components/CollectionsSection";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar />
      <Hero />
      <CollectionsSection />
      
      {/* Temporary Test Wrapper */}
      <div className="p-20 flex justify-center">
        <ProductCard />
      </div>
    </main>
  );
}
