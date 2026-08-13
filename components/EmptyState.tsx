import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  actionHref,
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px] text-center p-6 animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-6">
        <Icon size={32} />
      </div>
      <h3 className="font-poppins font-semibold text-xl text-primary mb-2">{title}</h3>
      <p className="font-poppins text-sm text-stone-500 max-w-[400px] mb-8">
        {description}
      </p>
      
      {actionText && (
        actionHref ? (
          <Link 
            href={actionHref}
            className="h-[52px] px-8 flex justify-center items-center bg-primary hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest"
          >
            {actionText}
          </Link>
        ) : (
          <button 
            onClick={onAction}
            className="h-[52px] px-8 flex justify-center items-center bg-primary hover:bg-stone-800 transition-colors rounded-full font-poppins font-semibold text-sm text-white uppercase tracking-widest"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
}
