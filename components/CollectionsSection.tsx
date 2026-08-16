import Link from "next/link";
import Image from "next/image";
import CategoryCard from "./CategoryCard";

const CATEGORIES = [
  { id: 1, title: "Dress", imageUrl: "/hero-image/hero-1.jpg", href: "/category/dress" },
  { id: 2, title: "Hand Bags", imageUrl: "/hero-image/hero-2.jpg", href: "/category/hand-bags" },
  { id: 3, title: "Pants", imageUrl: "/hero-image/hero-3.jpg", href: "/category/pants" },
  { id: 4, title: "Shirts", imageUrl: "/hero-image/hero-1.jpg", href: "/category/shirts" },
  { id: 5, title: "Shorts", imageUrl: "/hero-image/hero-2.jpg", href: "/category/shorts" },
  { id: 6, title: "Tops", imageUrl: "/hero-image/hero-3.jpg", href: "/category/tops" },
];

export default function CollectionsSection() {
  return (
    <section className="relative w-full h-auto px-4 md:px-8 lg:px-[120px] py-10 md:py-[60px]">
      <Image 
        src="/dress-copy.jpg" 
        alt="Collections background" 
        fill 
        className="object-cover z-0"
        priority
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-stone-900/50 z-0 pointer-events-none" />
      
      <div className="relative z-10 w-full h-full flex flex-col max-w-[1280px] mx-auto">
      
      {/* Header Area */}
      <div className="flex flex-col items-center text-center mb-6 w-full">
        <span className="text-sm md:text-base font-poppins text-stone-200 block mb-2">
          Shop by Category
        </span>
        <h2 className="text-3xl md:text-[36px] font-signature text-stone-50 tracking-wide mb-2">
          Collections
        </h2>
        <p className="text-sm md:text-base font-poppins text-stone-200 font-extralight">
          Pieces edited for quiet luxury — cut clean, worn easy.
        </p>
      </div>

      {/* Explore More */}
      <div className="flex justify-end w-full mb-6">
        <Link 
          href="/collections" 
          className="text-sm md:text-base font-signature text-stone-50 hover:text-stone-300 transition-colors tracking-wider"
        >
          Explore more
        </Link>
      </div>

      {/* Infinite Carousel Row */}
      <div className="w-[100vw] relative left-1/2 -translate-x-1/2 overflow-hidden mt-2">
        <div className="flex animate-marquee whitespace-nowrap w-max hover:[animation-play-state:paused]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex shrink-0">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="w-[160px] md:w-[220px] lg:w-[280px] shrink-0 px-1 md:px-2">
                  <CategoryCard 
                    title={cat.title}
                    imageUrl={cat.imageUrl}
                    href={cat.href}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      </div>
    </section>
  );
}
