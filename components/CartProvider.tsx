"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import CartSidePanel from "./CartSidePanel";
import WishlistSidePanel from "./WishlistSidePanel";

interface CartContextType {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  return (
    <CartContext.Provider 
      value={{ 
        isCartOpen, 
        openCart: () => setIsCartOpen(true), 
        closeCart: () => setIsCartOpen(false),
        isWishlistOpen,
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false)
      }}
    >
      {children}
      <CartSidePanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistSidePanel isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
