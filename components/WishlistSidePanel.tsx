"use client";

import { useEffect } from "react";
import { X, Heart } from "lucide-react";
import CartItem from "./CartItem";

export default function WishlistSidePanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Prevent body scroll when wishlist is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const wishlistItems = [
    {
      id: 1,
      name: "Vesper Long Sleeve Top – Pink",
      size: "UK : 08",
      quantity: 1,
      price: "2190.00",
      image: "/products/default.jpg"
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-[#F5F5F4]/40 backdrop-blur-[4px] z-[100] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-full max-w-[363px] bg-[#FAFAF9] z-[101] shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col p-[20px] gap-[10px]`}
      >
        
        <div className="flex flex-col flex-1 gap-[1px]">
          {/* Header */}
          <div className="flex items-center justify-between py-[21px] px-[10px] border-b border-[#1C1917]/50 h-[66.5px] flex-shrink-0">
            <h2 className="font-poppins font-semibold text-[16px] leading-[24px] text-[#1C1917]">
              My Wishlist
            </h2>
            <button 
              onClick={onClose}
              className="flex justify-center items-center w-[24px] h-[24px] bg-[#1C1917] rounded-full hover:bg-stone-700 transition-colors"
            >
              <X className="w-[14px] h-[14px] text-[#FAFAF9]" />
            </button>
          </div>

          {/* Scrollable Items Container */}
          <div className="flex-1 overflow-y-auto py-[10px] flex flex-col gap-[10px] pr-[5px]">
            {wishlistItems.length > 0 ? (
              wishlistItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  size={item.size}
                  quantity={item.quantity}
                  price={item.price}
                  image={item.image}
                  mode="wishlist"
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-[16px] text-stone-500">
                <Heart className="w-12 h-12 opacity-50" />
                <p className="font-poppins font-medium text-[14px]">Your wishlist is empty.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Area */}
        <div className="flex flex-col gap-[10px] w-full flex-shrink-0 pt-[21px]">
          <button 
            onClick={onClose}
            className="flex justify-center items-center w-full h-[36px] bg-[#D6D3D1] rounded-full hover:bg-stone-400 transition-colors"
          >
            <span className="font-inter font-bold text-[12px] leading-[15px] text-[#1C1917]">
              Continue Shopping
            </span>
          </button>
        </div>

      </div>
    </>
  );
}
