import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventory.service';

export const INVENTORY_KEYS = {
  all: ['inventory'] as const,
  list: (params?: object) => ['inventory', 'list', params] as const,
  stats: () => ['inventory', 'stats'] as const,
  transactions: (params?: object) => ['inventory', 'transactions', params] as const,
  transfers: (params?: object) => ['inventory', 'transfers', params] as const,
};

export function useInventory(params?: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: INVENTORY_KEYS.list(params),
    queryFn: () => inventoryService.getInventory(params),
  });
}

export function useInventoryStats() {
  return useQuery({
    queryKey: INVENTORY_KEYS.stats(),
    queryFn: () => inventoryService.getStats(),
    staleTime: 30_000,
  });
}

export function useInventoryTransactions(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: INVENTORY_KEYS.transactions(params),
    queryFn: () => inventoryService.getTransactions(params),
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.adjustStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

export function useTransfers(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: INVENTORY_KEYS.transfers(params),
    queryFn: () => inventoryService.getTransfers(params),
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.transfers() });
    },
  });
}

export function useUpdateTransferStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      inventoryService.updateTransferStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.transfers() });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.stats() });
    },
  });
}
