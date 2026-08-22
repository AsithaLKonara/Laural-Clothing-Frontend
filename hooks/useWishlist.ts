import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@/services/wishlist.service';

export const WISHLIST_KEYS = {
  all: ['wishlist'] as const,
  session: (sessionId: string | null) => ['wishlist', sessionId] as const,
};

export function useWishlist(sessionId: string | null, customerId?: string) {
  return useQuery({
    queryKey: WISHLIST_KEYS.session(sessionId),
    queryFn: () => {
      if (!sessionId && !customerId) throw new Error('No session ID or customer ID');
      return wishlistService.getWishlist(sessionId!, customerId);
    },
    enabled: !!sessionId || !!customerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAddToWishlist(sessionId: string | null, wishlistId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!wishlistId) {
        // Fallback: fetch the wishlist if we don't have its ID yet
        if (!sessionId) throw new Error('No session ID');
        const wishlist = await wishlistService.getWishlist(sessionId);
        return wishlistService.addItem(wishlist.id, productId);
      }
      return wishlistService.addItem(wishlistId, productId);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(WISHLIST_KEYS.session(sessionId), data);
    },
  });
}

export function useRemoveFromWishlist(sessionId: string | null, wishlistId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!wishlistId) {
        if (!sessionId) throw new Error('No session ID');
        const wishlist = await wishlistService.getWishlist(sessionId);
        return wishlistService.removeItem(wishlist.id, productId);
      }
      return wishlistService.removeItem(wishlistId, productId);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(WISHLIST_KEYS.session(sessionId), data);
    },
  });
}
