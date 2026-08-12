"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHome && !isScrolled;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
      isTransparent 
        ? "bg-transparent border-transparent" 
        : "bg-stone-50 border-b border-stone-200"
    }`}>
      <div className="w-full px-[120px] h-[83px] grid grid-cols-3 items-center">
        
        {/* Left Links */}
        <div className="flex items-center space-x-[40px] text-stone-900 text-[12px] font-bold font-poppins">
          <Link href="/" className="hover:text-stone-500 transition-colors">HOME</Link>
          <Link href="/shop" className="hover:text-stone-500 transition-colors">SHOP</Link>
          <Link href="/about" className="hover:text-stone-500 transition-colors">ABOUT US</Link>
          <Link href="/contact" className="hover:text-stone-500 transition-colors">CONTACT US</Link>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <Image 
              src="/logo.webp" 
              alt="Laural Clothing" 
              width={140} 
              height={40} 
              className="object-contain"
            />
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end space-x-8">
          <Link href="/login" className="text-stone-900 text-[12px] font-bold font-poppins hover:text-stone-500 transition-colors">
            LOGIN/REGISTER
          </Link>
          
          <div className="flex items-center space-x-1">
            <button className="p-2.5 hover:bg-stone-100 rounded-full transition-colors">
              <Search size={20} className="text-stone-900" />
            </button>
            <Link href="/wishlist" className="p-2.5 hover:bg-stone-100 rounded-full transition-colors">
              <Heart size={20} className="text-stone-900" />
            </Link>
            
            <Link href="/cart" className="flex items-center space-x-2 p-2.5 hover:bg-stone-100 rounded-full transition-colors">
              <ShoppingCart size={20} className="text-stone-900" />
              <span className="font-bold text-[12px] font-poppins text-stone-800">Rs: 0.00</span>
            </Link>
          </div>
        </div>
        
      </div>
    </nav>
  );
}
