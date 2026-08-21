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

  getOrders: (params?: { page?: number; limit?: number; status?: string; branchId?: string; paymentGateway?: string }) => 
    api.get<any>('/orders', { params }),

  getOrderById: (id: string) => 
    api.get<any>(`/orders/${id}`),

  updateOrderStatus: (id: string, status: string) => 
    api.patch<any>(`/orders/${id}/status`, { status }),
};
