import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { posService } from '@/services/pos.service';

// --- POS Sessions ---
export const useOpenSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: posService.openSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-session'] });
    },
  });
};

export const useCloseSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: posService.closeSession,
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
      return await posService.getCurrentSession(terminalId);
    },
    enabled: !!terminalId,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};

export const useExpectedClosing = (sessionId?: string) => {
  return useQuery({
    queryKey: ['pos-expected-closing', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      return await posService.getExpectedClosing(sessionId);
    },
    enabled: !!sessionId,
    refetchOnMount: 'always'
  });
};

export const useSessionSummary = (sessionId?: string) => {
  return useQuery({
    queryKey: ['pos-session-summary', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      return await posService.getSessionSummary(sessionId);
    },
    enabled: !!sessionId,
    refetchOnMount: 'always'
  });
};

// --- Exchange Vouchers ---
export const useGenerateVoucher = () => {
  return useMutation({
    mutationFn: posService.generateVoucher
  });
};

export const useValidateVoucher = () => {
  return useMutation({
    mutationFn: posService.validateVoucher
  });
};

// --- POS Orders ---
export const useProcessPosOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: posService.processPosOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });
};
