import api from './api';

export interface Coupon {
  id: string;
  name: string;
  code: string;
  type: string;
  value: number;
  usageLimit?: number | null;
  usedCount: number;
  expiryDate?: string | null;
  status: string;
  createdAt: string;
}

export interface FlashSaleItem {
  id: string;
  flashSaleId: string;
  variantId: string;
  salePrice: number;
  variant?: any; // For display
}

export interface FlashSale {
  id: string;
  name: string;
  description?: string;
  discount: number;
  status: string;
  startDate?: string | null;
  endDate?: string | null;
  items: FlashSaleItem[];
  createdAt: string;
}

export const promotionService = {
  // Coupons
  getCoupons: async (): Promise<Coupon[]> => {
    const { data } = await api.get('/promotions/coupons');
    return data;
  },
  
  createCoupon: async (payload: any): Promise<Coupon> => {
    const { data } = await api.post('/promotions/coupons', payload);
    return data;
  },
  
  updateCoupon: async (id: string, payload: any): Promise<Coupon> => {
    const { data } = await api.put(`/promotions/coupons/${id}`, payload);
    return data;
  },
  
  deleteCoupon: async (id: string): Promise<void> => {
    await api.delete(`/promotions/coupons/${id}`);
  },

  // Flash Sales
  getFlashSales: async (): Promise<FlashSale[]> => {
    const { data } = await api.get('/promotions/flash-sales');
    return data;
  },
  
  createFlashSale: async (payload: any): Promise<FlashSale> => {
    const { data } = await api.post('/promotions/flash-sales', payload);
    return data;
  },
  
  updateFlashSale: async (id: string, payload: any): Promise<FlashSale> => {
    const { data } = await api.put(`/promotions/flash-sales/${id}`, payload);
    return data;
  },
  
  deleteFlashSale: async (id: string): Promise<void> => {
    await api.delete(`/promotions/flash-sales/${id}`);
  }
};
