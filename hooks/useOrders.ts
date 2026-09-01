import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/order.service";

export function useOrders(params?: { search?: string; page?: number; limit?: number; status?: string; branchId?: string; paymentGateway?: string; customerId?: string; type?: string }) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const response = await orderService.getOrders(params);
      return response.data; // { data: [...], meta: {...} }
    },
  });
}

export function useOrderById(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const response = await orderService.getOrderById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await orderService.updateOrderStatus(id, status);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] });
    },
  });
}

export const useDispatchOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderService.dispatchOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useTrackOrderByPhone = (phone: string | undefined) => {
  return useQuery({
    queryKey: ["trackOrder", phone],
    queryFn: () => orderService.trackOrderByPhone(phone as string),
    enabled: !!phone && phone.length > 5,
    retry: false,
  });
};

export function useTrackOrder() {
  return useMutation({
    mutationFn: async ({ orderNumber, phone }: { orderNumber: string; phone: string }) => {
      const response = await orderService.trackOrder(orderNumber, phone);
      return response.data;
    }
  });
}

export function useOrderConfirmation(orderNumber: string, simulated?: boolean) {
  return useQuery({
    queryKey: ["orderConfirmation", orderNumber, simulated],
    queryFn: async () => {
      const response = await orderService.getOrderConfirmation(orderNumber, simulated);
      return response.data;
    },
    enabled: !!orderNumber,
    retry: 2,
  });
}

export function useRefundOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await orderService.refundOrder(id);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },
  });
}

