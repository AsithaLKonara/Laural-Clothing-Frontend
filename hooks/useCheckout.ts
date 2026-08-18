import { useMutation } from '@tanstack/react-query';
import { checkoutService, InitiateCheckoutPayload } from '@/services/checkout.service';

export function useCalculateCheckout(sessionId: string | null) {
  return useMutation({
    mutationFn: ({ cartId, shippingAddress }: { cartId: string; shippingAddress: any }) => {
      if (!sessionId) throw new Error('No session ID');
      return checkoutService.calculate(sessionId, cartId, shippingAddress);
    },
  });
}

export function useInitiateCheckout(sessionId: string | null) {
  return useMutation({
    mutationFn: (payload: InitiateCheckoutPayload) => {
      if (!sessionId) throw new Error('No session ID');
      return checkoutService.initiate(sessionId, payload);
    },
  });
}
