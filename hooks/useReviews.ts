import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', 'product', productId],
    queryFn: () => reviewService.getReviewsForProduct(productId),
    enabled: !!productId,
  });
}

export function useCustomerReviews(customerId: string) {
  return useQuery({
    queryKey: ['reviews', 'customer', customerId],
    queryFn: () => reviewService.getCustomerReviews(customerId),
    enabled: !!customerId,
  });
}

export function usePendingReviews(customerId: string) {
  return useQuery({
    queryKey: ['reviews', 'pending', customerId],
    queryFn: () => reviewService.getPendingReviews(customerId),
    enabled: !!customerId,
  });
}

export function useAllReviews(status?: string, page: number = 1, limit: number = 20, search?: string) {
  return useQuery({
    queryKey: ['reviews', 'all', status, page, limit, search],
    queryFn: () => reviewService.getAllReviews(status, page, limit, search),
  });
}

export function useReviewStats() {
  return useQuery({
    queryKey: ['reviews', 'stats'],
    queryFn: () => reviewService.getReviewStats(),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'customer', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'pending', variables.customerId] });
    },
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'PENDING' | 'APPROVED' | 'REJECTED' }) =>
      reviewService.updateReviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
