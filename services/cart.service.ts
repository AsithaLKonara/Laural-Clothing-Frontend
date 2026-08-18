import api from './api';

export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  variant: any; // Add more specific type if needed
}

export interface Cart {
  id: string;
  sessionId?: string;
  customerId?: string;
  status: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

const getHeaders = (sessionId: string) => ({
  headers: {
    'x-session-id': sessionId,
  },
});

export const cartService = {
  async getCart(sessionId: string): Promise<Cart> {
    const { data } = await api.get<Cart>('/cart', getHeaders(sessionId));
    return data;
  },

  async addItem(sessionId: string, payload: { variantId: string; quantity: number }): Promise<Cart> {
    const { data } = await api.post<Cart>('/cart/items', payload, getHeaders(sessionId));
    return data;
  },

  async updateItemQuantity(sessionId: string, itemId: string, quantity: number): Promise<Cart> {
    const { data } = await api.put<Cart>(`/cart/items/${itemId}`, { quantity }, getHeaders(sessionId));
    return data;
  },

  async removeItem(sessionId: string, itemId: string): Promise<Cart> {
    const { data } = await api.delete<Cart>(`/cart/items/${itemId}`, getHeaders(sessionId));
    return data;
  },
};
