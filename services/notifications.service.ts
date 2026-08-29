import { api } from './api';

export interface BulkSmsPayload {
  numbers: string[];
  message: string;
  flashSaleId?: string;
}

export interface PushBroadcastPayload {
  title: string;
  body: string;
  url?: string;
  imageUrl?: string;
  flashSaleId?: string;
}

export interface PushSubscriptionPayload {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const notificationsService = {
  async sendBulkSms(payload: BulkSmsPayload) {
    const { data } = await api.post('/notifications/sms/bulk', payload);
    return data;
  },

  async broadcastPush(payload: PushBroadcastPayload) {
    const { data } = await api.post('/notifications/push/broadcast', payload);
    return data;
  },

  async getVapidKey(): Promise<string> {
    const { data } = await api.get('/notifications/push/vapid-key');
    return data.data.publicKey;
  },

  async subscribePush(payload: PushSubscriptionPayload) {
    const { data } = await api.post('/notifications/push/subscribe', payload);
    return data;
  }
};
