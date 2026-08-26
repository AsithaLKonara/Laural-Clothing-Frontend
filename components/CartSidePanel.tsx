"use client";

import { useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from "@/hooks/useCart";
import Link from "next/link";
import Image from "next/image";

const FREE_SHIPPING_THRESHOLD = 15000;

export default function CartSidePanel() {
  const { sessionId, initSession, isDrawerOpen, closeDrawer } = useCartStore();

  useEffect(() => {
    initSession();
  }, [initSession]);

  const { data: cart, isLoading, isFetching } = useCart(sessionId);
  const updateItem = useUpdateCartItem(sessionId);
  const removeItem = useRemoveCartItem(sessionId);
  const clearCart = useClearCart(sessionId);

  // Prevent body scroll when cart is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };

    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * (item.variant?.salePrice ?? item.variant?.price ?? 0),
    0
  );

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Side Panel */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={`fixed top-0 right-0 h-full w-[440px] max-w-[100vw] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-out flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={20} className="text-stone-900" />
            <h2 className="font-poppins font-semibold text-lg tracking-tight text-stone-900">
              Shopping Cart
            </h2>
            {itemCount > 0 && (
              <span className="bg-stone-100 text-stone-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={() => clearCart.mutate()}
                disabled={clearCart.isPending}
                className="text-xs text-stone-400 hover:text-red-600 transition-colors mr-2 disabled:opacity-50"
                title="Clear entire cart"
              >
                Clear
              </button>
            )}
            <button 
              onClick={closeDrawer} 
              className="p-2 text-stone-400 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100 -mr-2"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Bar */}
        {items.length > 0 && (
          <div className="bg-stone-50 px-6 py-3.5 border-b border-stone-200">
            <div className="flex items-center justify-between text-xs font-poppins mb-1.5">
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-600" /> You qualify for FREE islandwide shipping!
                </span>
              ) : (
                <span className="text-stone-600">
                  Add <strong className="text-stone-900 font-semibold">Rs. {amountNeededForFreeShipping.toLocaleString()}</strong> more for Free Shipping
                </span>
              )}
              <span className="text-stone-400 font-medium">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  freeShippingProgress >= 100 ? 'bg-emerald-600' : 'bg-stone-900'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Content Items List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 divide-y divide-stone-100">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-stone-400 text-sm font-poppins gap-3">
              <Loader2 size={24} className="animate-spin text-stone-800" />
              <span>Loading your cart...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 text-stone-500 my-auto py-12">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-2">
                <ShoppingBag size={36} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-poppins font-medium text-lg text-stone-900">Your cart is empty</p>
                <p className="font-poppins text-xs text-stone-500 mt-1 max-w-[240px]">
                  Explore our quiet luxury collections and discover your next signature piece.
                </p>
              </div>
              <Link 
                href="/shop" 
                onClick={closeDrawer} 
                className="mt-4 px-6 py-3 bg-stone-900 text-white font-poppins font-medium text-xs uppercase tracking-widest hover:bg-black transition-colors rounded-sm shadow-sm"
              >
                Explore Shop
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const variant = item.variant;
              const product = variant?.product;
              const unitPrice = variant?.salePrice ?? variant?.price ?? 0;
              const itemTotal = unitPrice * item.quantity;

              // Image extraction
              let imgUrl = "/products/default.jpg";
              if (variant?.featuredImage) {
                imgUrl = variant.featuredImage;
              } else if (variant?.gallery && variant.gallery.length > 0) {
                imgUrl = variant.gallery[0];
              } else if (product?.variants) {
                for (const v of product.variants) {
                  if (v.featuredImage) {
                    imgUrl = v.featuredImage;
                    break;
                  }
                  if (v.gallery && v.gallery.length > 0) {
                    imgUrl = v.gallery[0];
                    break;
                  }
                }
              }

              const isItemPending = (updateItem.isPending && (updateItem.variables as any)?.itemId === item.id) ||
                                    (removeItem.isPending && (removeItem.variables as any) === item.id);

              return (
                <div key={item.id} className={`pt-4 first:pt-0 flex gap-4 transition-opacity ${isItemPending ? 'opacity-50' : 'opacity-100'}`}>
                  {/* Image */}
                  <Link 
                    href={product?.slug ? `/products/${product.slug}` : "/shop"} 
                    onClick={closeDrawer}
                    className="w-[84px] h-[105px] bg-stone-100 overflow-hidden shrink-0 relative rounded-sm group block"
                  >
                    <Image 
                      src={imgUrl} 
                      alt={product?.name || "Product"} 
                      fill 
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link 
                          href={product?.slug ? `/products/${product.slug}` : "/shop"}
                          onClick={closeDrawer}
                          className="font-poppins font-medium text-stone-900 text-xs hover:text-stone-600 transition-colors line-clamp-1"
                        >
                          {product?.name || "Product Name"}
                        </Link>
                        <button 
                          onClick={() => removeItem.mutate(item.id)}
                          disabled={removeItem.isPending}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1 -mr-1 -mt-1"
                          title="Remove item"
                          aria-label={`Remove ${product?.name || 'item'}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Variant tags */}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {variant?.name && (
                          <span className="text-[11px] font-poppins text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                            {variant.name}
                          </span>
                        )}
                        {variant?.size && (
                          <span className="text-[11px] font-poppins text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                            Size: {variant.size}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and Quantity row */}
                    <div className="flex items-end justify-between mt-3 pt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-stone-200 rounded-sm bg-white overflow-hidden shadow-2xs">
                        <button 
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 });
                            } else {
                              removeItem.mutate(item.id);
                            }
                          }}
                          disabled={updateItem.isPending || removeItem.isPending}
                          className="w-7 h-7 flex items-center justify-center text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-poppins text-xs font-medium w-8 text-center text-stone-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                          disabled={updateItem.isPending}
                          className="w-7 h-7 flex items-center justify-center text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-poppins font-semibold text-stone-900 text-sm">
                          Rs. {itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-stone-400 font-poppins">
                            (Rs. {unitPrice.toLocaleString()} each)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50 shrink-0 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-poppins">
                <span className="text-stone-600 text-sm">Subtotal</span>
                <span className="font-bold text-stone-900 text-lg">
                  Rs. {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-poppins">
                Shipping, taxes, and promotional coupons applied at checkout.
              </p>
            </div>
            
            <div className="flex flex-col gap-2.5 mt-2">
              <Link 
                href="/checkout"
                onClick={closeDrawer}
                className="w-full"
              >
                <button className="w-full py-4 bg-stone-900 hover:bg-black transition-all rounded-sm font-poppins font-medium text-xs text-white uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  <span>Checkout</span>
                  <ArrowRight size={15} />
                </button>
              </Link>

              <Link 
                href="/cart"
                onClick={closeDrawer}
                className="w-full"
              >
                <button className="w-full py-3 bg-white hover:bg-stone-100 border border-stone-300 transition-colors rounded-sm font-poppins font-medium text-xs text-stone-900 uppercase tracking-wider text-center">
                  View Full Cart
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

