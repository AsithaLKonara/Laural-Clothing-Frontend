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
        className={`fixed top-0 right-0 h-[100dvh] w-full max-w-[363px] bg-background z-[101] shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col p-[20px] gap-[10px]`}
      >
        
        <div className="flex flex-col flex-1 gap-[1px]">
          {/* Header */}
          <div className="flex items-center justify-between py-[21px] px-[10px] border-b border-primary/50 h-[66.5px] flex-shrink-0">
            <h2 className="font-poppins font-semibold text-base leading-[24px] text-primary">
              Shopping Cart
            </h2>
            <button 
              onClick={onClose}
              className="flex justify-center items-center w-[24px] h-[24px] bg-primary rounded-full hover:bg-stone-700 transition-colors"
            >
              <X className="w-[14px] h-[14px] text-background" />
            </button>
          </div>

          {/* Scrollable Items Container */}
          <div className="flex-1 overflow-y-auto py-[10px] flex flex-col gap-[10px] pr-[5px]">
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
              <div className="flex flex-col items-center justify-center h-full gap-[16px] text-stone-500">
                <ShoppingBag className="w-12 h-12 opacity-50" />
                <p className="font-poppins font-medium text-sm">Your cart is currently empty.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Area */}
        {cartItems.length > 0 && (
          <div className="flex flex-col gap-[10px] w-full flex-shrink-0">
            <div className="flex justify-between items-center py-[21px] border-t border-primary/50 h-[66.5px]">
              <span className="font-poppins font-semibold text-base leading-[24px] text-primary">
                Subtotal :
              </span>
              <span className="font-poppins font-semibold text-base leading-[24px] text-primary">
                Rs: 4080.00
              </span>
            </div>
            <div className="flex flex-col gap-[10px]">
              <button className="flex justify-center items-center w-full h-[36px] bg-[#D6D3D1] rounded-full hover:bg-stone-400 transition-colors">
                <span className="font-inter font-bold text-xs leading-[15px] text-primary">
                  View Cart
                </span>
              </button>
              <button className="flex justify-center items-center w-full h-[36px] bg-primary rounded-full hover:bg-stone-800 transition-colors">
                <span className="font-inter font-bold text-xs leading-[15px] text-background">
                  Checkout
                </span>
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
