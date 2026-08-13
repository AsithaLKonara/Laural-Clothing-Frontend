"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <footer className="relative flex flex-col items-center w-full bg-stone-900 text-[#FAFAF9]">
      
      {/* Main Footer Section with Image Background */}
      <div className="relative flex flex-col items-center w-full pt-10 md:pt-[72px]">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/footer/bg.jpg?v=2"
            alt="Footer Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        {/* Content Row */}
        <div className="relative z-10 flex flex-col md:flex-row flex-wrap items-start justify-between w-full max-w-[1280px] px-4 md:px-8 lg:px-[120px] gap-10 md:gap-[64px]">
          
          {/* Brand Col */}
          <div className="flex flex-col items-start gap-[20px] w-[320px]">
            {/* Logo */}
            <div className="relative w-[180px] h-[40px]">
               <Image src="/logo-white.png" alt="Laural Clothing" fill className="object-contain object-left" />
            </div>
            
            {/* Contact Items */}
            <div className="flex flex-col gap-[12px] w-full mt-2">
              <div className="flex items-center gap-[10px]">
                <MapPin className="w-[20px] h-[20px] text-[#FAFAF9]" />
                <span className="font-inter text-[14px] leading-[21px] text-[#FAFAF9]/90">Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-[10px]">
                <Phone className="w-[20px] h-[20px] text-[#FAFAF9]" />
                <span className="font-inter text-[14px] leading-[21px] text-[#FAFAF9]/90">+94 76 112 8979</span>
              </div>
              <div className="flex items-center gap-[10px]">
                <Mail className="w-[20px] h-[20px] text-[#FAFAF9]" />
                <span className="font-inter text-[14px] leading-[21px] text-[#FAFAF9]/90">info.lauralclothing.com</span>
              </div>
            </div>
          </div>

          {/* Links Cols */}
          <div className="flex flex-col sm:flex-row gap-8 lg:gap-[48px] flex-1">
            {/* Shop Col */}
            <div className="flex flex-col gap-[25px]">
              <div className="flex flex-col gap-[16px]">
                <h4 className="font-inter font-bold text-[14px] tracking-[0.02em] uppercase text-[#FAFAF9]">Shop</h4>
                <div className="flex flex-col gap-[10px]">
                  {["Collared Top", "Core Crop Tank Top", "Raglan Top", "Shirt"].map(link => (
                    <Link href="#" key={link} className="font-inter text-[14px] text-[#FAFAF9]/85 hover:text-white transition-colors">{link}</Link>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-[16px]">
                <h4 className="font-inter font-bold text-[14px] tracking-[0.02em] uppercase text-[#FAFAF9]">Support</h4>
                <div className="flex flex-col gap-[10px]">
                  <Link href="/track-order" className="font-inter text-[14px] text-[#FAFAF9]/85 hover:text-white transition-colors">Track Order</Link>
                </div>
              </div>
            </div>
            
            {/* Categories Col */}
            <div className="flex flex-col gap-[16px]">
              <h4 className="font-inter font-bold text-[14px] tracking-[0.02em] uppercase text-[#FAFAF9]">Categories</h4>
              <div className="flex flex-col gap-[10px]">
                {["Pants", "Tops", "T-Shirts", "Shorts"].map(link => (
                  <Link href="#" key={link} className="font-inter text-[14px] text-[#FAFAF9]/85 hover:text-white transition-colors">{link}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Col */}
          <div className="flex flex-col gap-[16px] w-full md:w-[360px]">
            <h4 className="font-inter font-bold text-[14px] tracking-[0.02em] uppercase text-[#FAFAF9]">Newsletter</h4>
            <p className="font-inter text-[14px] leading-[21px] text-[#FAFAF9]/90">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex flex-col gap-[10px] w-full mt-2">
              <div className="flex items-center px-[14px] w-full h-[48px] bg-stone-900 border border-[#FAFAF9] rounded-full">
                <Mail className="w-[20px] h-[20px] text-[#FAFAF9]" />
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#FAFAF9] placeholder:text-[#FAFAF9]/75 ml-[10px]" 
                />
              </div>
              <button className="flex justify-center items-center w-full h-[48px] bg-[#FAFAF9] rounded-full hover:bg-stone-200 transition-colors">
                <span className="font-inter font-bold text-[14px] text-[#1C1917]">Subscribe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legal & Social Pre-Bottom */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-[1280px] px-4 md:px-8 lg:px-[120px] mt-8 md:mt-[48px]">
          <div className="w-full h-[1px] bg-[#FAFAF9]/20" />
          <div className="flex flex-col md:flex-row justify-between items-center w-full py-[20px] gap-6 md:gap-0">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-[16px]">
              {["About", "Privacy Policy", "Terms & Conditions"].map(link => (
                <Link href="#" key={link} className="font-inter text-[13px] text-[#FAFAF9]/85 hover:text-white transition-colors">{link}</Link>
              ))}
            </div>
            <div className="flex items-center gap-[16px]">
              <div className="flex justify-center items-center w-[40px] h-[40px] border border-[#FAFAF9] rounded-full hover:bg-[#FAFAF9]/10 transition-colors cursor-pointer">
                {/* Facebook SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FAFAF9]">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </div>
              <div className="flex justify-center items-center w-[40px] h-[40px] border border-[#FAFAF9] rounded-full hover:bg-[#FAFAF9]/10 transition-colors cursor-pointer">
                {/* Instagram SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FAFAF9]">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* True Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full py-4 md:py-0 min-h-[40px] px-4 md:px-8 lg:px-[120px] bg-[#FAFAF9] gap-4 md:gap-0">
        <p className="font-inter text-[13px] text-[#1C1917]/85 text-center md:text-left">
          © 2026 Laural Clothing. All Rights Reserved. Developed by ScriptLK Digital
        </p>
        <div className="relative w-[309px] h-[24px]">
          <Image src="/footer/payments.webp" alt="Payment Methods" fill className="object-contain md:object-right" />
        </div>
      </div>
    </footer>
  );
}
