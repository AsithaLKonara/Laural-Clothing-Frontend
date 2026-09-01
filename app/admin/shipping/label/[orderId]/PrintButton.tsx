"use client";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-stone-900 text-white px-4 py-2 rounded-lg font-inter text-sm hover:bg-stone-800"
    >
      Print Label
    </button>
  );
}
