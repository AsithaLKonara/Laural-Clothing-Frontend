import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export interface PaymentTransaction {
  id: string;
  order: string;
  customer: string;
  gateway: string;
  method: string;
  amount: number;
  amountStr: string;
  status: string;
  created: string;
}

export interface PaymentKpi {
  totalAmount: number;
  successfulCount: string;
  pendingCount: string;
  failedCount: string;
  successRate: number;
}

const fetchPaymentTransactions = async (params?: { gateway?: string; page?: number; limit?: number }): Promise<{ data: PaymentTransaction[]; meta: any }> => {
  try {
    const response = await api.get("/payments/transactions", { params });
    return response.data;
  } catch (error) {
    return { data: [], meta: {} };
  }
};

const fetchPaymentKpis = async (gateway?: string): Promise<{ data: PaymentKpi }> => {
  try {
    const response = await api.get("/payments/kpis", { params: { gateway } });
    return response.data;
  } catch (error) {
    return { 
      data: { 
        totalAmount: 0, 
        successfulCount: "0", 
        pendingCount: "0", 
        failedCount: "0", 
        successRate: 0 
      } 
    };
  }
};

export function usePaymentTransactions(params?: { gateway?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["payment-transactions", params],
    queryFn: () => fetchPaymentTransactions(params),
  });
}

export function usePaymentKpis(gateway?: string) {
  return useQuery({
    queryKey: ["payment-kpis", gateway],
    queryFn: () => fetchPaymentKpis(gateway),
  });
}
