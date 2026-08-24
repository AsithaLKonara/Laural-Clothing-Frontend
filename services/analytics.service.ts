import { api } from './api';

export const analyticsService = {
  getBusinessOverview: async (period: string, branch: string) => {
    const { data } = await api.get('/analytics/overview', {
      params: { period, branch }
    });
    return data;
  }
};
