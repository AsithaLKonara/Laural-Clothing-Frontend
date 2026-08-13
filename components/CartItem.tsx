import Image from "next/image";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";

export interface CartItemProps {
  id: number | string;
  name: string;
  size: string;
  quantity: number;
  price: string;
  image: string;
  mode?: "cart" | "wishlist";
  onRemove?: (id: number | string) => void;
  onAddToCart?: (id: number | string) => void;
  onUpdateQuantity?: (id: number | string, newQuantity: number) => void;
}

export default function CartItem({ 
  id, 
  name, 
  size, 
  quantity, 
  price, 
  image, 
  mode = "cart",
  onRemove,
  onAddToCart,
  onUpdateQuantity
}: CartItemProps) {
  return (
    <div className="group flex flex-row items-start p-[10px] gap-[10px] bg-background w-full h-[119px] flex-shrink-0 border border-transparent hover:border-stone-300 hover:shadow-md transition-all duration-300 cursor-pointer rounded-[4px]">
      
      {/* Product Image */}
      <div className="relative w-[99px] h-[99px] bg-stone-100 flex-shrink-0 overflow-hidden rounded-[2px]">
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between h-[99px] flex-1">
        <div className="flex justify-end h-[16px]">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(id);
            }}
            className="flex justify-center items-center w-[16px] h-[16px] bg-primary rounded-full hover:bg-red-600 hover:scale-110 transition-all duration-200"
          >
            <X className="w-[10px] h-[10px] text-background" />
          </button>
        </div>
        
        <div className="flex flex-col justify-center gap-[6px] h-[84px]">
          <h3 className="font-poppins font-bold text-xs leading-[18px] text-primary line-clamp-1 group-hover:text-stone-600 transition-colors duration-200">
            {name}
          </h3>
          <span className="font-poppins font-normal text-xs leading-[14px] text-primary">
            {size}
          </span>
          
          <div className="flex flex-row items-center justify-between mt-1">
            <span className="font-poppins font-medium text-xs leading-[18px] text-primary">
              Rs: {price}
            </span>

            {/* Mode-specific actions */}
            {mode === "cart" ? (
              <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-[4px] px-2 py-0.5">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (quantity > 1) onUpdateQuantity?.(id, quantity - 1);
                  }}
                  className="text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-poppins font-medium text-[11px] w-[14px] text-center">{quantity}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateQuantity?.(id, quantity + 1);
                  }}
                  className="text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart?.(id);
                }}
                className="flex items-center gap-[4px] px-[8px] py-[4px] bg-primary text-background rounded-[4px] hover:bg-stone-700 transition-colors"
              >
                <ShoppingBag className="w-3 h-3" />
                <span className="font-inter font-bold text-[10px]">Add</span>
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
