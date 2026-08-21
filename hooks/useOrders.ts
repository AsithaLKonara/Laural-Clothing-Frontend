import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/order.service";

export function useOrders(params?: { page?: number; limit?: number; status?: string; branchId?: string; paymentGateway?: string }) {
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
