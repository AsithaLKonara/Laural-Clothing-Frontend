import React from "react";

export interface PageBannerProps {
  title: string;
  description?: string;
}

export default function PageBanner({ title, description }: PageBannerProps) {
  return (
    <div className="w-full bg-primary py-12 px-4 flex flex-col items-center justify-center text-center">
      <h1 className="font-poppins font-semibold text-4xl md:text-5xl text-background leading-tight mb-2">
        {title}
      </h1>
      {description && (
        <p className="font-poppins text-base text-background/70 max-w-[600px]">
          {description}
        </p>
      )}
    </div>
  );
}
