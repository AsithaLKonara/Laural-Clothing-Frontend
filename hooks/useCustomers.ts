import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  orders: number;
  spent: string;
  lastActive: string;
}

const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await api.get<Customer[]>("/customers");
    return response.data;
  } catch (error) {
    return [];
  }
};

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });
}
