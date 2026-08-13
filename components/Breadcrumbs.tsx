import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap py-4">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link 
                href={item.href} 
                className="font-urbanist text-[13px] text-[#1C1917]/70 hover:text-[#1C1917] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={`font-urbanist text-[13px] ${isLast ? "text-[#1C1917] font-medium" : "text-[#1C1917]/70"}`}>
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight size={14} className="text-[#1C1917]/40 flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
