import { useQuery } from "@tanstack/react-query";
import { mockCustomers } from "../services/mockData";
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
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockCustomers as Customer[];
};

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });
}
