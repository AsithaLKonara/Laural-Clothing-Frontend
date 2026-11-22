import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promotionService } from '../services/promotion.service';

// --- Coupons ---
export function useCoupons(params?: { search?: string; status?: string; type?: string }) {
  return useQuery({
    queryKey: ['coupons', params],
    queryFn: () => promotionService.getCoupons(params),
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: promotionService.createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => promotionService.updateCoupon(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: promotionService.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

// --- Flash Sales ---
export function useFlashSales(params?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: ['flash-sales', params],
    queryFn: () => promotionService.getFlashSales(params),
  });
}

export function useCreateFlashSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: promotionService.createFlashSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-sales'] });
    },
  });
}

export function useUpdateFlashSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => promotionService.updateFlashSale(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-sales'] });
    },
  });
}

export function useDeleteFlashSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: promotionService.deleteFlashSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-sales'] });
    },
  });
}
