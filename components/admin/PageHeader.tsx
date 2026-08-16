"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export default function PageHeader({ title, subtitle, actionLabel, onActionClick }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
      <div>
        <h1 className="font-inria text-2xl md:text-3xl text-stone-900 mb-1">{title}</h1>
        {subtitle && <p className="font-inter text-sm text-stone-500">{subtitle}</p>}
      </div>
      {actionLabel && (
        <button 
          onClick={onActionClick}
          className="px-4 py-2 bg-stone-900 text-white font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors shadow-sm whitespace-nowrap"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
