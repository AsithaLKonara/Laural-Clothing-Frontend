import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useReturns = (page: number, limit: number, search?: string, status?: string) => {
  return useQuery({
    queryKey: ['returns', { page, limit, search, status }],
    queryFn: async () => {
      const res = await api.get('/returns', {
        params: { page, limit, search, status }
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['returns', variables.id] });
    },
  });
};
