import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";

export default function CategoryBar() {
  const { data: categories = [] } = useCategories();

  return (
    <div className="w-full bg-[#E7E5E4]">
      <div className="flex flex-row justify-center items-center flex-wrap gap-x-[30px] gap-y-[10px] w-full max-w-[1280px] mx-auto py-[16px] px-[20px] md:px-[120px]">
        {categories.map((link) => (
          <Link 
            href={`/category/${link.toLowerCase().replace(' ', '-')}`} 
            key={link} 
            className="font-urbanist font-black text-sm text-primary hover:text-[#5E3122] transition-colors uppercase"
          >
            {link}
          </Link>
        ))}
      </div>
    </div>
  );
}
