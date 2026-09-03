import { ProductVariant } from "@/types/product";

export function getEffectivePrice(variant: any): number {
  if (!variant) return 0;
  
  const basePrice = variant.price || 0;
  let effectivePrice = variant.salePrice || basePrice;

  if (variant.flashSaleItems && variant.flashSaleItems.length > 0) {
    const now = new Date();
    const activeFlashSaleItem = variant.flashSaleItems.find((item: any) => {
      const fs = item.flashSale;
      if (!fs || fs.status !== 'ACTIVE') return false;
      
      const startDate = fs.startDate ? new Date(fs.startDate) : null;
      const endDate = fs.endDate ? new Date(fs.endDate) : null;
      
      if (startDate && now < startDate) return false;
      if (endDate && now > endDate) return false;
      
      return true;
    });

    if (activeFlashSaleItem) {
      effectivePrice = activeFlashSaleItem.salePrice;
    }
  }

  return effectivePrice;
}
