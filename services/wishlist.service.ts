import axios from 'axios';
import { Product } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
    
    const response = await axios.get(`${API_URL}/wishlist?${params.toString()}`);
    return response.data;
  },

  addItem: async (wishlistId: string, productId: string): Promise<Wishlist> => {
    const response = await axios.post(`${API_URL}/wishlist`, { wishlistId, productId });
    return response.data;
  },

  removeItem: async (wishlistId: string, productId: string): Promise<Wishlist> => {
    const response = await axios.delete(`${API_URL}/wishlist/${wishlistId}/${productId}`);
    return response.data;
  }
};
