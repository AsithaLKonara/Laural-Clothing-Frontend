import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService, Cart } from '@/services/cart.service';
import { useCartStore } from '@/store/useCartStore';

export const CART_KEYS = {
  all: ['cart'] as const,
  session: (sessionId?: string | null) => ['cart', sessionId] as const,
};

export function useCart(sessionId?: string | null) {
  const storeSessionId = useCartStore((state) => state.sessionId);
  const activeSessionId = sessionId || storeSessionId;

  return useQuery({
    queryKey: CART_KEYS.session(activeSessionId),
    queryFn: () => {
      const resolvedSessionId = activeSessionId || useCartStore.getState().getSessionId();
      return cartService.getCart(resolvedSessionId);
    },
    enabled: typeof window !== 'undefined',
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useAddToCart(sessionId?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { variantId: string; quantity: number }) => {
      const activeSessionId = sessionId || useCartStore.getState().getSessionId();
      return cartService.addItem(activeSessionId, payload);
    },
    onSuccess: (data: Cart) => {
      const activeSessionId = sessionId || useCartStore.getState().sessionId;
      queryClient.setQueryData(CART_KEYS.session(activeSessionId), data);
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    },
  });
}

export function useUpdateCartItem(sessionId?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const activeSessionId = sessionId || useCartStore.getState().getSessionId();
      return cartService.updateItemQuantity(activeSessionId, itemId, quantity);
    },
    onSuccess: (data: Cart) => {
      const activeSessionId = sessionId || useCartStore.getState().sessionId;
      queryClient.setQueryData(CART_KEYS.session(activeSessionId), data);
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    },
  });
}

export function useRemoveCartItem(sessionId?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => {
      const activeSessionId = sessionId || useCartStore.getState().getSessionId();
      return cartService.removeItem(activeSessionId, itemId);
    },
    onSuccess: (data: Cart) => {
      const activeSessionId = sessionId || useCartStore.getState().sessionId;
      queryClient.setQueryData(CART_KEYS.session(activeSessionId), data);
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    },
  });
}

export function useClearCart(sessionId?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      const activeSessionId = sessionId || useCartStore.getState().getSessionId();
      return cartService.clearCart(activeSessionId);
    },
    onSuccess: (data: Cart) => {
      const activeSessionId = sessionId || useCartStore.getState().sessionId;
      queryClient.setQueryData(CART_KEYS.session(activeSessionId), data);
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    },
  });
}

export function useMergeCart(sessionId?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerId: string) => {
      const activeSessionId = sessionId || useCartStore.getState().getSessionId();
      return cartService.mergeCarts(activeSessionId, customerId);
    },
    onSuccess: (data: Cart) => {
      const activeSessionId = sessionId || useCartStore.getState().sessionId;
      queryClient.setQueryData(CART_KEYS.session(activeSessionId), data);
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    },
  });
}

