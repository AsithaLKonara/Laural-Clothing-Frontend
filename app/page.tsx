import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CollectionsSection from "@/components/CollectionsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar />
      <Hero />
      <CollectionsSection />
    </main>
  );
}
