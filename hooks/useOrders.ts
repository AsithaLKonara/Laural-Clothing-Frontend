import { useQuery, useMutation } from "@tanstack/react-query";
import { mockOrders } from "../services/mockData";
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
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockOrders as Order[];
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
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Mock create order:", newOrder);
      // Simulate returning the created order with a generated ID
      return { id: `LC-${Math.floor(10000 + Math.random() * 90000)}`, ...newOrder } as Order;
    },
  });
}
