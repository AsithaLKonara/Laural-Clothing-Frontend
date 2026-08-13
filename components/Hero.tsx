"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const HERO_IMAGES = [
  "/hero-image/hero-1.jpg",
  "/hero-image/hero-2.jpg",
  "/hero-image/hero-3.jpg",
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000); // 5 second intervals

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[600px] md:h-[829px] overflow-hidden bg-stone-100">
      {/* Carousel Images */}
      {HERO_IMAGES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Hero Image ${index + 1}`}
          fill
          priority={index === 0}
          className={`object-cover object-top transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Gradient Overlay */}
      {/* 
        Matches user spec: 
        0% to 40% -> transparent
        80% -> stone-50 (#fafaf9)
        This blends the bottom of the hero perfectly into the background of the page.
      */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, transparent 40%, #fafaf9 80%, #fafaf9 100%)"
        }}
      />
      {/* Text Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end text-stone-900 px-4 md:px-8 lg:px-[120px] pb-10 md:py-[60px]">
        <h2 className="font-poppins text-[10px] md:text-xs tracking-[0.2em] uppercase mb-2 font-semibold text-center">
          Timeless silhouettes. Refined details. Effortless confidence.
        </h2>
        
        <h1 className="font-signature text-5xl sm:text-[60px] lg:text-[80px] mb-4 mt-1 text-stone-900 tracking-wide text-center">
          Elegance, Redefined.
        </h1>
        
        <p className="font-poppins font-extralight text-sm max-w-2xl text-center mb-5 leading-relaxed text-stone-900">
          Discover a curated collection of sophisticated women’s wear, thoughtfully designed for those who appreciate understated luxury, impeccable style, and effortless elegance.
        </p>
        
        <button className="bg-primary text-[#f5f5f4] font-sans font-bold text-xs uppercase px-[42px] py-[13px] rounded-full hover:bg-stone-700 transition-colors">
          Explore The Collections
        </button>
      </div>
    </section>
  );
}
