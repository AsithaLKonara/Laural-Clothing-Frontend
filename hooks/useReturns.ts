import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useReturns = (page: number, limit: number, search?: string, status?: string, customerId?: string) => {
  return useQuery({
    queryKey: ['returns', { page, limit, search, status, customerId }],
    queryFn: async () => {
      const res = await api.get('/returns', {
        params: { page, limit, search, status, customerId }
      });
      return res.data;
    },
  });
};

export const useReturnDetails = (rmaId: string) => {
  return useQuery({
    queryKey: ['returns', rmaId],
    queryFn: async () => {
      const res = await api.get(`/returns/${rmaId}`);
      return res.data;
    },
    enabled: !!rmaId,
  });
};

export const useUpdateReturnStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, items }: { id: string, status: string, items?: any[] }) => {
      const res = await api.put(`/returns/${id}/status`, { status, items });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['return'] });
    }
  });
};

export const useVerifyOrderForReturn = (orderNumber: string, email: string) => {
  return useQuery({
    queryKey: ['verifyReturnOrder', orderNumber, email],
    queryFn: async () => {
      if (!orderNumber || !email) return null;
      const res = await api.get('/returns/verify', {
        params: { orderNumber, email }
      });
      return res.data;
    },
    enabled: !!orderNumber && !!email,
    retry: false
  });
};

export const useCreateReturn = () => {
  return useMutation({
    mutationFn: async (data: { orderId: string, items: { orderItemId: string, quantity: number, reason: string, details?: string }[] }) => {
      const res = await api.post('/returns', data);
      return res.data;
    }
  });
};
