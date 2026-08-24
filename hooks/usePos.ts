import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

// --- POS Sessions ---
export const useOpenSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { branchId: string; terminalId: string; userId: string; openingFloat: number }) => {
      const res = await api.post('/pos/sessions/open', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-session'] });
    },
  });
};

export const useCloseSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { sessionId: string; actualClosing: number }) => {
      const res = await api.post('/pos/sessions/close', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-session'] });
    },
  });
};

export const useCurrentSession = (terminalId?: string) => {
  return useQuery({
    queryKey: ['pos-session', terminalId],
    queryFn: async () => {
      if (!terminalId) return null;
      const res = await api.get(`/pos/sessions/current?terminalId=${terminalId}`);
      return res.data;
    },
    enabled: !!terminalId,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};

// --- Exchange Vouchers ---
export const useGenerateVoucher = () => {
  return useMutation({
    mutationFn: async (data: { branchId: string; returnedItems: any[]; value: number }) => {
      const res = await api.post('/pos/vouchers/generate', data);
      return res.data;
    }
  });
};

export const useValidateVoucher = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await api.get(`/pos/vouchers/${code}`);
      return res.data;
    }
  });
};

// --- POS Orders ---
export const useProcessPosOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      branchId: string;
      sessionId: string;
      customerId?: string;
      items: any[];
      paymentMethod: string;
      appliedVouchers: string[];
      subtotal: number;
      total: number;
      tax: number;
    }) => {
      const res = await api.post('/pos/orders', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });
};
