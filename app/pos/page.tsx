"use client";

import { Maximize, Search, Trash2, CreditCard, Banknote, LayoutGrid, UserPlus, X, ChevronRight, CheckCircle2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import VariantSelectionModal from "@/components/pos/VariantSelectionModal";
import PaymentModal from "@/components/pos/PaymentModal";
import CustomerSelectionModal from "@/components/pos/CustomerSelectionModal";
import OrderSuccessModal from "@/components/pos/OrderSuccessModal";
import PosReturnsMode from "@/components/pos/PosReturnsMode";
import PosDispatchTicket from "@/components/pos/PosDispatchTicket";
import PosExchangeTicket from "@/components/pos/PosExchangeTicket";
import PosShiftModal from "@/components/pos/PosShiftModal";
import { RotateCcw, ShoppingCart, Zap, ArrowLeft, Clock, History, ArrowRightLeft } from "lucide-react";
import Link from "next/link";

export default function POSPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [posMode, setPosMode] = useState<"SALES" | "RETURNS" | "DISPATCH" | "EXCHANGE">("SALES");
  
  // Modal states
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  
  // New States for POS Upgrades
  const [shiftState, setShiftState] = useState<"CLOSED" | "OPEN">("CLOSED");
  const [shiftModalMode, setShiftModalMode] = useState<"OPEN" | "CLOSE" | null>(null);
  
  const [heldCarts, setHeldCarts] = useState<{id: string, time: string, items: any[]}[]>([]);
  const [isHeldCartsModalOpen, setIsHeldCartsModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  const holdCurrentCart = () => {
    if (cart.length === 0) return;
    setHeldCarts(prev => [...prev, { id: `H-${Math.floor(Math.random() * 10000)}`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), items: [...cart] }]);
    clearCart();
  };

  const restoreHeldCart = (heldId: string) => {
    const held = heldCarts.find(h => h.id === heldId);
    if (held) {
      setCart(held.items);
      setHeldCarts(prev => prev.filter(h => h.id !== heldId));
      setIsHeldCartsModalOpen(false);
    }
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const clearCart = () => setCart([]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const categories = ["All", "T-Shirts", "Shirts", "Dresses", "Pants", "Accessories"];
  const products = [
    { id: 1, name: "Black Oversized T-Shirt", price: "2,500", image: "/products/default.jpg" },
    { id: 2, name: "Classic Linen Shirt", price: "4,900", image: "/products/hover.jpg" },
    { id: 3, name: "Summer Floral Dress", price: "6,500", image: "/products/default.jpg" },
    { id: 4, name: "Cargo Pants", price: "5,200", image: "/products/hover.jpg" },
    { id: 5, name: "Ribbed Tank Top", price: "1,800", image: "/products/default.jpg" },
    { id: 6, name: "Denim Jacket", price: "8,500", image: "/products/hover.jpg" },
    { id: 7, name: "Pleated Skirt", price: "4,200", image: "/products/default.jpg" },
    { id: 8, name: "Basic White Tee", price: "2,000", image: "/products/hover.jpg" },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-background">
      
      {/* POS Header */}
      <div className="h-[60px] bg-surface text-foreground flex items-center justify-between px-6 shrink-0 shadow-sm border-b border-border z-10">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors mr-2 group">
            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center group-hover:bg-surface transition-colors">
              <ArrowLeft size={16} />
            </div>
          </Link>
          <h1 className="font-bold text-lg tracking-widest uppercase flex items-center gap-2">
            <LayoutGrid size={18} /> LAURAL POS
          </h1>
          
          {/* Mode Switcher */}
          <div className="hidden sm:flex bg-background border border-border rounded-lg p-1">
            <button 
              onClick={() => setPosMode("SALES")}
              className={`px-4 py-1.5 rounded-md font-inter font-bold text-xs flex items-center gap-2 transition-colors ${posMode === 'SALES' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:bg-surface'}`}
            >
              <ShoppingCart size={14} /> SALES
            </button>
            <button 
              onClick={() => setPosMode("RETURNS")}
              className={`px-4 py-1.5 rounded-md font-inter font-bold text-xs flex items-center gap-2 transition-colors ${posMode === 'RETURNS' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:bg-surface'}`}
            >
              <RotateCcw size={14} /> RETURNS
            </button>
            <button 
              onClick={() => setPosMode("EXCHANGE")}
              className={`px-4 py-1.5 rounded-md font-inter font-bold text-xs flex items-center gap-2 transition-colors ${posMode === 'EXCHANGE' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:bg-surface'}`}
            >
              <ArrowRightLeft size={14} /> EXCHANGE
            </button>
            <button 
              onClick={() => setPosMode("DISPATCH")}
              className={`px-4 py-1.5 rounded-md font-inter font-bold text-xs flex items-center gap-2 transition-colors ${posMode === 'DISPATCH' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:bg-surface'}`}
            >
              <Zap size={14} /> DISPATCH
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-sm font-inter text-muted ml-4">
            <span>Kandy Branch</span>
            <span className="w-1 h-1 rounded-full bg-muted"></span>
            <span>Terminal #02</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => setShiftModalMode(shiftState === "CLOSED" ? "OPEN" : "CLOSE")}
            className="hidden md:flex items-center gap-2 hover:bg-surface border border-transparent hover:border-border px-3 py-1.5 rounded transition-colors cursor-pointer"
          >
            <div className={`w-2 h-2 rounded-full ${shiftState === "OPEN" ? "bg-success animate-pulse" : "bg-error"}`}></div>
            <span className="text-sm font-inter font-bold text-foreground">
              {shiftState === "OPEN" ? "Shift OPEN" : "Shift CLOSED"}
            </span>
          </button>
          
          <button 
            onClick={() => setIsHeldCartsModalOpen(true)}
            className="hidden md:flex items-center gap-2 text-sm font-inter text-muted hover:text-foreground transition-colors border-l border-border pl-6 relative"
          >
            <History size={16} />
            <span>Held Orders</span>
            {heldCarts.length > 0 && (
              <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {heldCarts.length}
              </span>
            )}
          </button>
          <div className="hidden md:flex items-center gap-2 text-sm font-inter text-muted border-l border-border pl-6">
            <span>Cashier: Kasun</span>
          </div>
          <button 
            onClick={toggleFullscreen}
            className="flex items-center gap-2 bg-background hover:bg-border border border-border px-3 py-1.5 rounded transition-colors text-sm font-inter md:ml-4"
          >
            <Maximize size={14} />
            <span className="hidden sm:inline">{isFullscreen ? "Exit Full Screen" : "Full Screen"}</span>
          </button>
        </div>
      </div>

      {/* Main Layout Area */}
      {posMode === "RETURNS" ? (
        <PosReturnsMode />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Side: Products (2/3 width) */}
          <div className="flex-1 flex flex-col bg-surface overflow-hidden border-r border-border">
            
            {/* Search Bar */}
            <div className="p-4 border-b border-border shrink-0">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="text" 
                  placeholder="Search products, scan barcode..."
                  className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 text-lg font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  autoFocus
                />
              </div>
            </div>

            {/* Categories */}
            <div className="px-4 py-3 border-b border-border flex gap-2 overflow-x-auto shrink-0 scrollbar-hide">
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  className={`px-6 py-3 rounded-lg font-inter font-semibold text-sm whitespace-nowrap transition-colors border ${
                    idx === 0 ? "bg-primary-soft text-primary border-primary shadow-sm" : "bg-surface text-muted border-border hover:bg-background"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-4 bg-background pb-24 lg:pb-4">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => { 
                      if (posMode === "DISPATCH" || posMode === "EXCHANGE") {
                        addToCart(p);
                      } else {
                        setSelectedProduct(p); setIsVariantModalOpen(true); 
                      }
                    }}
                    className="bg-surface border border-border rounded-xl flex flex-col hover:border-accent hover:shadow-md transition-all text-left active:scale-95 overflow-hidden"
                  >
                    <div className="relative w-full aspect-square bg-stone-100">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="p-3 flex flex-col justify-between flex-1">
                      <span className="font-inter font-bold text-foreground text-sm leading-snug line-clamp-2 mb-2">
                        {p.name}
                      </span>
                      <div className="flex justify-between items-end w-full">
                        <span className="font-inter font-bold text-primary text-lg">
                          {p.price}
                        </span>
                        <span className="font-inter text-[10px] uppercase tracking-wider font-semibold text-muted bg-background border border-border px-1.5 py-0.5 rounded">
                          In Stock
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile FAB */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-40">
              <button 
                onClick={() => setIsMobileCartOpen(true)}
                className="w-full bg-primary text-white py-4 rounded-full shadow-xl shadow-primary/30 flex items-center justify-between px-6 font-inter font-bold"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} />
                  <span>{cart.length > 0 ? cart.reduce((a, b) => a + b.qty, 0) : 2} Items</span>
                </div>
                <span>View Order</span>
              </button>
            </div>

          </div>

          {/* Right Side: Cart & Payment */}
          {posMode === "DISPATCH" ? (
            <PosDispatchTicket 
              isMobileCartOpen={isMobileCartOpen}
              setIsMobileCartOpen={setIsMobileCartOpen}
              cart={cart}
              updateQty={updateQty}
              clearCart={clearCart}
            />
          ) : posMode === "EXCHANGE" ? (
            <PosExchangeTicket 
              isMobileCartOpen={isMobileCartOpen}
              setIsMobileCartOpen={setIsMobileCartOpen}
              cart={cart}
              updateQty={updateQty}
              clearCart={clearCart}
            />
          ) : (
            <div className={`fixed inset-y-0 right-0 w-full sm:w-[420px] bg-surface flex flex-col shrink-0 shadow-2xl lg:shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-50 lg:z-0 lg:static transform transition-transform duration-300 lg:translate-x-0 ${isMobileCartOpen ? "translate-x-0" : "translate-x-full"}`}>
              {/* Rest of Sales Cart goes here */}
              <div className="p-4 border-b border-border bg-background flex justify-between items-center shrink-0 h-[60px]">
                <h2 className="font-inter font-bold text-lg flex items-center gap-2">
                  <button className="lg:hidden p-1 -ml-1 text-muted" onClick={() => setIsMobileCartOpen(false)}>
                    <X size={20} />
                  </button>
                  Current Order
                </h2>
                <button 
                  onClick={() => setIsCustomerModalOpen(true)}
                  className="flex items-center gap-2 text-sm font-inter text-primary bg-primary-soft px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <UserPlus size={16} /> Add Customer
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted gap-2 h-full opacity-60">
                    <p className="font-inter text-sm">Cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex flex-col bg-background border border-border rounded-lg p-3 relative group">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-inter font-bold text-foreground leading-snug pr-8">{item.name}</span>
                        <button onClick={() => updateQty(item.id, -item.qty)} className="absolute top-3 right-3 text-muted hover:text-error transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="text-xs font-inter text-muted mb-3">
                        Color: Default | Size: M
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 rounded-full bg-surface border border-border font-bold text-muted flex items-center justify-center hover:bg-background">-</button>
                          <span className="font-inter font-bold text-lg w-4 text-center text-foreground">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 rounded-full bg-surface border border-border font-bold text-muted flex items-center justify-center hover:bg-background">+</button>
                        </div>
                        <span className="font-inter font-bold text-foreground">{(Number(item.price.replace(/,/g, "")) * item.qty).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals & Payment Actions */}
              <div className="border-t border-border bg-surface p-6 shrink-0 flex flex-col gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <div className="mt-4">
                  <button 
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover rounded-xl py-4 transition-colors shadow-lg shadow-primary/20"
                  >
                    <span className="font-inter font-bold text-lg text-white">Charge</span>
                    <ChevronRight size={20} className="text-white" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button 
                    onClick={holdCurrentCart}
                    disabled={cart.length === 0}
                    className="bg-background hover:bg-border disabled:opacity-50 text-foreground font-inter font-semibold py-3 rounded-lg text-sm transition-colors border border-border"
                  >
                    Hold Cart
                  </button>
                  <button onClick={clearCart} className="bg-error-soft hover:bg-red-200 text-error hover:text-red-700 font-inter font-semibold py-3 rounded-lg text-sm transition-colors border border-error-soft">
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
      

      {/* Modals */}
      {shiftModalMode && (
        <PosShiftModal 
          mode={shiftModalMode} 
          onClose={() => setShiftModalMode(null)} 
          onSuccess={() => {
            setShiftState(shiftModalMode === "OPEN" ? "OPEN" : "CLOSED");
            setShiftModalMode(null);
          }} 
        />
      )}
      
      {/* Held Carts Modal Slide-out */}
      {isHeldCartsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[80vh]">
            <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-stone-50 shrink-0">
              <h2 className="font-inter font-bold text-xl text-stone-900 flex items-center gap-2">
                <History className="text-stone-700" size={24} /> Held Orders
              </h2>
              <button onClick={() => setIsHeldCartsModalOpen(false)} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-stone-100 flex-1 overflow-y-auto flex flex-col gap-3">
              {heldCarts.length === 0 ? (
                <div className="text-center text-stone-500 py-10 font-inter">No held orders.</div>
              ) : (
                heldCarts.map(hc => (
                  <div key={hc.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-stone-900 font-inter">{hc.id}</p>
                      <p className="text-sm text-stone-500 font-inter">{hc.items.length} items • {hc.time}</p>
                    </div>
                    <button 
                      onClick={() => restoreHeldCart(hc.id)}
                      className="px-4 py-2 bg-stone-900 text-white font-inter font-semibold text-sm rounded-lg hover:bg-stone-800 transition-colors"
                    >
                      Resume
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {isVariantModalOpen && <VariantSelectionModal product={selectedProduct} onClose={() => setIsVariantModalOpen(false)} />}
      {isPaymentModalOpen && <PaymentModal onClose={() => setIsPaymentModalOpen(false)} onSuccess={() => { setIsPaymentModalOpen(false); setIsSuccessModalOpen(true); }} total="9,400" />}
      {isCustomerModalOpen && <CustomerSelectionModal onClose={() => setIsCustomerModalOpen(false)} />}
      {isSuccessModalOpen && <OrderSuccessModal onClose={() => setIsSuccessModalOpen(false)} />}

    </div>
  );
}
