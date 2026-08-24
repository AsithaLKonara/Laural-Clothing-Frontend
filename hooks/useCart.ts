import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';

export const CART_KEYS = {
  all: ['cart'] as const,
  session: (sessionId: string | null) => ['cart', sessionId] as const,
};

export function useCart(sessionId: string | null) {
  return useQuery({
    queryKey: CART_KEYS.session(sessionId),
    queryFn: () => {
      if (!sessionId) throw new Error('No session ID');
      return cartService.getCart(sessionId);
    },
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAddToCart(sessionId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { variantId: string; quantity: number }) => {
      if (!sessionId) throw new Error('No session ID');
      return cartService.addItem(sessionId, payload);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(CART_KEYS.session(sessionId), data);
    },
  });
}

export function useUpdateCartItem(sessionId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (!sessionId) throw new Error('No session ID');
      return cartService.updateItemQuantity(sessionId, itemId, quantity);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(CART_KEYS.session(sessionId), data);
    },
  });
}

export function useRemoveCartItem(sessionId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => {
      if (!sessionId) throw new Error('No session ID');
      return cartService.removeItem(sessionId, itemId);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(CART_KEYS.session(sessionId), data);
    },
  });
}
