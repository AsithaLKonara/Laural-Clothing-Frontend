import api from './api';

export const orderService = {
  getAllOrders: async () => {
    const { data } = await api.get('/orders');
    return data;
  },
  
  dispatchOrder: async (orderId: string) => {
    const { data } = await api.post(`/orders/${orderId}/dispatch`);
    return data;
  },

  trackOrderByPhone: async (phone: string) => {
    const { data } = await api.get(`/orders/track/phone/${encodeURIComponent(phone)}`);
    return data;
  }
};
