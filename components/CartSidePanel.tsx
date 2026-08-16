"use client";

import { useEffect } from "react";
import { X, ShoppingBag } from "lucide-react";
import CartItem from "./CartItem";

export default function CartSidePanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Prevent body scroll when cart is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const cartItems = [
    {
      id: 1,
      name: "Vesper Long Sleeve Top – Pink",
      size: "UK : 08",
      quantity: 1,
      price: "2190.00",
      image: "/products/default.jpg"
    },
    {
      id: 2,
      name: "Core Crop Tank Top",
      size: "UK : 10",
      quantity: 1,
      price: "1890.00",
      image: "/products/hover.jpg"
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
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={`fixed top-0 right-0 h-[100dvh] w-full max-w-[380px] bg-white z-[101] shadow-2xl transition-transform duration-500 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        
        <div className="flex flex-col flex-1 gap-[1px]">
          {/* Header */}
          <div className="flex items-center justify-between py-6 px-6 border-b border-stone-100 flex-shrink-0">
            <h2 className="font-poppins font-light text-xl text-stone-900 tracking-wide">
              Shopping Cart
            </h2>
            <button 
              onClick={onClose}
              className="flex justify-center items-center p-2 -mr-2 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5 stroke-[1]" />
            </button>
          </div>

          {/* Scrollable Items Container */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  size={item.size}
                  quantity={item.quantity}
                  price={item.price}
                  image={item.image}
                  mode="cart"
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-stone-400">
                <ShoppingBag className="w-10 h-10 stroke-[1]" />
                <p className="font-poppins font-light text-sm tracking-wide">Your cart is currently empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Area */}
        {cartItems.length > 0 && (
          <div className="flex flex-col w-full flex-shrink-0 bg-stone-50 border-t border-stone-100 px-6 py-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6">
              <span className="font-poppins font-light text-sm text-stone-500 uppercase tracking-wider">
                Subtotal
              </span>
              <span className="font-inter font-medium text-lg text-stone-900">
                Rs. 4,080.00
              </span>
            </div>
            <button className="flex justify-center items-center w-full py-3.5 bg-stone-900 hover:bg-black transition-colors">
              <span className="font-poppins font-medium text-xs text-white uppercase tracking-[0.15em]">
                Proceed to Checkout
              </span>
            </button>
          </div>
        )}

      </div>
    </>
  );
}
