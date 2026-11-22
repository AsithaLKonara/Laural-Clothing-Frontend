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
  date: string;
}

export interface PaymentKpi {
  totalAmount: number;
  pendingAmount: number;
  successfulCount: string;
  pendingCount: string;
  failedCount: string;
  successRate: number;
  chartData: Array<{ date: string; collected: number; pending: number }>;
  gatewayData: Array<{ name: string; value: number; transactions: number }>;
}

const fetchPaymentTransactions = async (params?: { gateway?: string; page?: number; limit?: number; search?: string; status?: string; startDate?: string; endDate?: string }): Promise<{ data: PaymentTransaction[]; meta: any }> => {
  try {
    const response = await api.get("/payments/transactions", { params });
    return response.data;
  } catch (error) {
    return { data: [], meta: {} };
  }
};

const fetchPaymentKpis = async (params?: { gateway?: string; startDate?: string; endDate?: string }): Promise<{ data: PaymentKpi }> => {
  try {
    const response = await api.get("/payments/kpis", { params });
    return response.data;
  } catch (error) {
    return { 
      data: { 
        totalAmount: 0, 
        pendingAmount: 0,
        successfulCount: "0", 
        pendingCount: "0", 
        failedCount: "0", 
        successRate: 0,
        chartData: [],
        gatewayData: []
      } 
    };
  }
};

export function usePaymentTransactions(params?: { gateway?: string; page?: number; limit?: number; search?: string; status?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ["payment-transactions", params],
    queryFn: () => fetchPaymentTransactions(params),
  });
}

export function usePaymentKpis(params?: { gateway?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ["payment-kpis", params],
    queryFn: () => fetchPaymentKpis(params),
  });
}
