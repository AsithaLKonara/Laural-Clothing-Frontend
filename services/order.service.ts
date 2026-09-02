import api from './api';

export interface CustomerData {
  id?: string;
  phone: string;
  email?: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode?: string;
  isGuest?: boolean;
}

export interface QuickDispatchPayload {
  customer: CustomerData;
  branchId: string;
  items: {
    variantId: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
}

export const orderService = {
  searchCustomerByPhone: (phone: string) => 
    api.get<any>(`/orders/customers/search?phone=${encodeURIComponent(phone)}`),

  createQuickDispatch: (data: QuickDispatchPayload) => 
    api.post<any>('/orders/quick-dispatch', data),

  getOrders: (params?: { search?: string; page?: number; limit?: number; status?: string; branchId?: string; paymentGateway?: string; customerId?: string; type?: string }) => 
    api.get<any>('/orders', { params }),

  getOrderById: (id: string) => 
    api.get<any>(`/orders/${id}`),

  updateOrderStatus: (id: string, status: string) => 
    api.patch<any>(`/orders/${id}/status`, { status }),

  refundOrder: (id: string) => 
    api.post<any>(`/orders/${id}/refund`),
    
  refundPartialOrder: (id: string, itemsToReturn: { variantId: string, qty: number }[], refundMethod?: string) => 
    api.post<any>(`/orders/${id}/refund/partial`, { itemsToReturn, refundMethod }),

  getAllOrders: async () => {
    const { data } = await api.get('/orders');
    return data;
  },
  
  dispatchOrder: async (orderId: string) => {
    const { data } = await api.patch(`/orders/${orderId}/status`, { status: 'DISPATCHED' });
    return data;
  },

  trackOrderByPhone: async (phone: string) => {
    const { data } = await api.get(`/orders/track/phone/${encodeURIComponent(phone)}`);
    return data;
  },

  trackOrder: (orderNumber: string, phone: string) =>
    api.get<any>(`/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`),

  getOrderConfirmation: (orderNumber: string, simulated?: boolean) =>
    api.get<any>(`/orders/confirmation/${encodeURIComponent(orderNumber)}${simulated ? '?simulated=true' : ''}`),

  getLoyaltyPoints: (phone: string) =>
    api.get<any>(`/checkout/loyalty/${encodeURIComponent(phone)}`),
};

