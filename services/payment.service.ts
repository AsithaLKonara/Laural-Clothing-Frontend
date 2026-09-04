import api from './api';

export const paymentService = {
  async retryPayment(orderNumber: string, paymentMethod: string): Promise<any> {
    const { data } = await api.post(`/payments/retry/${orderNumber}`, { paymentMethod });
    return data;
  },
  
  async mockWebhook(provider: string, payload: { orderNumber: string, status: string }): Promise<any> {
    // We hit our own Next.js secure proxy, which will sign the payload and forward to backend
    const response = await fetch('/api/mock-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, payload })
    });
    
    if (!response.ok) {
      throw new Error('Webhook proxy failed');
    }
    return response.json();
  },

  async getPaymentMethods(): Promise<any[]> {
    const { data } = await api.get('/payments/methods');
    return data.data; // our API returns { success: true, data: [...] }
  }
};
