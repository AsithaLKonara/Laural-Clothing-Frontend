"use client";

import Breadcrumbs from "@/components/Breadcrumbs";

export default function ClientContent() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "FAQ" }
  ];

  return (
    <div className="w-full">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[120px] pt-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-3xl md:text-5xl font-urbanist font-black text-primary mt-6 mb-8 uppercase tracking-tight">
          Frequently Asked Questions
        </h1>
        <div className="max-w-3xl prose prose-stone">
          <p>This page is under construction.</p>
        </div>
      </div>
    </div>
  );
}
