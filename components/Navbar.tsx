"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAuth = pathname === "/login";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openCart, openWishlist } = useCart();

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/shop" },
    { name: "ABOUT US", href: "/about" },
    { name: "CONTACT US", href: "/contact" },
  ];
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Styling based on route and scroll state
  const isTransparent = isHome && !isScrolled;
  
  const navBgClass = isAuth
    ? "bg-black/20 backdrop-blur-md border-b border-white/5"
    : isTransparent
    ? "bg-transparent"
    : "bg-[#FAFAF9] shadow-sm border-b border-stone-200";

  const textColorClass = isAuth
    ? "text-stone-50"
    : "text-stone-900";

  const hoverBgClass = isAuth
    ? "hover:bg-white/10"
    : "hover:bg-stone-100";

  const logoImage = isAuth
    ? "/logo-white.png"
    : "/logo.webp";

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${navBgClass}`}>
      <div className="w-full px-[120px] h-[83px] grid grid-cols-3 items-center">
        
        {/* Left Links */}
        <div className="flex items-center space-x-[40px] text-[12px] font-bold font-poppins">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`transition-colors hover:text-stone-500 ${
                  isActive 
                    ? `${textColorClass} underline underline-offset-8 decoration-2` 
                    : textColorClass
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Center Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <div className="relative w-[180px] h-[26px]">
              <Image 
                src={logoImage}
                alt="Laural Clothing"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex justify-end">
          <div className="flex items-center gap-[4px] space-x-4 mr-4">
            <Link href="/login" className={`font-poppins font-bold text-[12px] tracking-wide uppercase transition-colors hover:opacity-70 ${textColorClass}`}>
              LOGIN/REGISTER
            </Link>
          </div>
          <div className="flex items-center gap-[4px]">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2.5 rounded-full transition-colors ${hoverBgClass}`}
            >
              <Search size={20} className={textColorClass} />
            </button>
            <button 
              onClick={openWishlist}
              className={`p-2.5 rounded-full transition-colors ${hoverBgClass}`}
            >
              <Heart size={20} className={textColorClass} />
            </button>
            
            <button onClick={openCart} className={`flex items-center space-x-2 p-2.5 rounded-full transition-colors ${hoverBgClass}`}>
              <ShoppingCart size={20} className={textColorClass} />
              <span className={`font-bold text-[12px] font-poppins ${textColorClass}`}>Rs: 0.00</span>
            </button>
          </div>
        </div>
        
      </div>
    </nav>
  );
}
