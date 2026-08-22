import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { orderService } from '@/services/order.service';

export interface Order {
  id: string;
  customer: string;
  branch: string;
  total: string;
  gateway: string;
  status: string;
  orderStatus: string;
}

const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get<Order[]>("/orders");
    return response.data;
  } catch (error) {
    return [];
  }
};

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (newOrder: Partial<Order>) => {
      const response = await api.post<Order>("/orders", newOrder);
      return response.data;
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
