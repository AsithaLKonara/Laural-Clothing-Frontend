import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../services/api";

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
