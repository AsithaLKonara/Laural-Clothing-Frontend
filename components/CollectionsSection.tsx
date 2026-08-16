import Link from "next/link";
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
    <section className="relative w-full h-auto px-4 md:px-8 lg:px-[120px] py-10 md:py-[60px] bg-background">
      <div className="relative z-10 w-full h-full flex flex-col max-w-[1280px] mx-auto">
      
      {/* Header Area */}
      <div className="flex flex-col items-center text-center mb-6 w-full">
        <span className="text-sm md:text-base font-poppins text-stone-500 block mb-2 uppercase tracking-widest">
          Shop by Category
        </span>
        <h2 className="text-3xl md:text-4xl font-signature text-stone-900 tracking-wide mb-2">
          Collections
        </h2>
        <p className="text-sm md:text-base font-inria text-stone-600 italic">
          Pieces edited for quiet luxury — cut clean, worn easy.
        </p>
      </div>

      {/* Explore More */}
      <div className="flex justify-end w-full mb-6">
        <Link 
          href="/collections" 
          className="text-sm md:text-base font-signature text-stone-900 hover:text-stone-500 transition-colors tracking-wider border-b border-stone-900 pb-0.5"
        >
          Explore more
        </Link>
      </div>

      {/* Cards Row */}
      <div className="flex flex-wrap md:flex-nowrap w-full mt-2">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="w-1/2 md:flex-1 overflow-hidden">
            <CategoryCard 
              title={cat.title}
              imageUrl={cat.imageUrl}
              href={cat.href}
            />
          </div>
        ))}
      </div>
      
      </div>
    </section>
  );
}
