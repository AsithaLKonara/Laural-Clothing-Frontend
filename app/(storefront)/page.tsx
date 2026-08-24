import Hero from "@/components/Hero";
import CollectionsSection from "@/components/CollectionsSection";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import CuratedCollectionsSection from "@/components/CuratedCollectionsSection";
import OfferCollectionSection from "@/components/OfferCollectionSection";
import AdBannerSection from "@/components/AdBannerSection";
import BrandStorySection from "@/components/BrandStorySection";
import TestimonialSection from "@/components/TestimonialSection";
import { serverFetch } from "@/lib/server-fetch";
import { PaginatedResponse } from "@/types/api";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

export default async function Home() {
  // Fetch SEO-critical data on the server in parallel
  const [categoriesRes, newArrivalsRes, offersRes] = await Promise.all([
    serverFetch<PaginatedResponse<Category>>("/categories", { tags: ["categories"], revalidate: 3600 }).catch(() => undefined),
    serverFetch<PaginatedResponse<Product>>("/products", { tags: ["products"], revalidate: 3600 }).catch(() => undefined),
    serverFetch<PaginatedResponse<Product>>("/products?skip=8&take=8", { tags: ["products"], revalidate: 3600 }).catch(() => undefined),
  ]);

  return (
    <main className="min-h-screen bg-stone-50">
      <Hero />
      {/* Infinite Scroll Ribbon */}
      <div className="w-full bg-[#1A1A1A] py-3 overflow-hidden flex items-center">
        <div className="flex animate-marquee whitespace-nowrap w-max">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-5">
              <span className="font-poppins text-xs md:text-sm text-white tracking-[0.2em] uppercase font-light">
                Delivery Available Islandwide
              </span>
              <span className="font-poppins text-xs md:text-sm text-white tracking-[0.2em] uppercase font-light">
                •
              </span>
              <span className="font-poppins text-xs md:text-sm text-white tracking-[0.2em] uppercase font-light">
                Secure Payments
              </span>
              <span className="font-poppins text-xs md:text-sm text-white tracking-[0.2em] uppercase font-light">
                •
              </span>
              <span className="font-poppins text-xs md:text-sm text-white tracking-[0.2em] uppercase font-light">
                New Arrivals Every Week
              </span>
              <span className="font-poppins text-xs md:text-sm text-white tracking-[0.2em] uppercase font-light">
                •
              </span>
              <span className="font-poppins text-xs md:text-sm text-white tracking-[0.2em] uppercase font-light">
                Premium Quality
              </span>
              <span className="font-poppins text-xs md:text-sm text-white tracking-[0.2em] uppercase font-light">
                •
              </span>
            </div>
          ))}
        </div>
      </div>
      <CollectionsSection initialData={categoriesRes} />
      <NewArrivalsSection initialData={newArrivalsRes} />
      <CuratedCollectionsSection />
      <OfferCollectionSection initialData={offersRes} />
      <AdBannerSection />
      <BrandStorySection />
      <TestimonialSection />
    </main>
  );
}
