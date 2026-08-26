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

const fetchCustomers = async (params?: { search?: string; type?: string; sort?: string; page?: number; limit?: number }): Promise<{ data: Customer[]; meta: any }> => {
  try {
    const response = await api.get("/customers", { params });
    return response.data;
  } catch (error) {
    return { data: [], meta: {} };
  }
};

export function useCustomers(params?: { search?: string; type?: string; sort?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => fetchCustomers(params),
  });
}
