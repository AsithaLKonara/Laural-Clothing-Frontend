"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || "/products/default.jpg");

  return (
    <div className="flex flex-col-reverse md:flex-row gap-[10px] w-full max-w-[463px]">
      
      {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
      <div className="flex flex-row md:flex-col gap-[10px] overflow-x-auto md:overflow-visible">
        {images.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`relative flex-shrink-0 w-[78px] h-[104px] bg-stone-100 overflow-hidden transition-all duration-300 ${
              activeImage === img ? "ring-1 ring-stone-900 opacity-100" : "opacity-60 hover:opacity-100"
            }`}
          >
            <Image 
              src={img} 
              alt={`Thumbnail ${idx + 1}`} 
              fill 
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative w-full aspect-[375/451] md:w-[375px] md:h-[451px] bg-stone-100 overflow-hidden">
        <Image 
          src={activeImage}
          alt="Product Main Image"
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />
        
        {/* Optional Badge */}
        <div className="absolute top-4 right-4 bg-red-500/10 backdrop-blur-sm px-[14px] py-[6px] rounded-full">
          <span className="font-poppins font-medium text-[16px] text-red-500">
            -40%
          </span>
        </div>
      </div>
      
    </div>
  );
}
