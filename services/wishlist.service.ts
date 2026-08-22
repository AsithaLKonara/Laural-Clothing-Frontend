import { api } from './api';
import { Product } from '@/types/product';
export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  sessionId?: string;
  customerId?: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export const wishlistService = {
  getWishlist: async (sessionId: string, customerId?: string): Promise<Wishlist> => {
    const params = new URLSearchParams();
    if (sessionId) params.append('sessionId', sessionId);
    if (customerId) params.append('customerId', customerId);
    
    const response = await api.get(`/wishlist?${params.toString()}`);
    return response.data;
  },

  addItem: async (wishlistId: string, productId: string): Promise<Wishlist> => {
    const response = await api.post(`/wishlist`, { wishlistId, productId });
    return response.data;
  },

  removeItem: async (wishlistId: string, productId: string): Promise<Wishlist> => {
    const response = await api.delete(`/wishlist/${wishlistId}/${productId}`);
    return response.data;
  }
};
