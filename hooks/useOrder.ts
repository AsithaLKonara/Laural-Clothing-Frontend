import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, QuickDispatchPayload } from '../services/order.service';

export function useOrder() {
  const queryClient = useQueryClient();

  const searchCustomer = async (phone: string) => {
    try {
      const res = await orderService.searchCustomerByPhone(phone);
      return res.data;
    } catch (error) {
      return null;
    }
  };

  const createQuickDispatch = useMutation({
    mutationFn: (data: QuickDispatchPayload) => orderService.createQuickDispatch(data),
    onSuccess: () => {
      // Invalidate orders list or inventory if necessary
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });

  return {
    searchCustomer,
    createQuickDispatch,
  };
}
