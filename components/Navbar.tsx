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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  const isTransparent = isHome && !isScrolled;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
      isTransparent 
        ? "bg-transparent border-transparent" 
        : "bg-stone-50 border-b border-stone-200"
    }`}>
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
                    ? "text-stone-900 underline underline-offset-8 decoration-2" 
                    : "text-stone-900"
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
            <div className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-48 opacity-100 mr-2' : 'w-0 opacity-0'}`}>
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-transparent border-b border-stone-900 focus:outline-none text-[12px] font-poppins py-1 text-stone-900 placeholder:text-stone-500" 
              />
            </div>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 hover:bg-stone-100 rounded-full transition-colors"
            >
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
