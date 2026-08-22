import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface SalesReport {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    aov: number;
  };
  dailyTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
    ecommerceRevenue: number;
    posRevenue: number;
  }>;
}

export interface BranchReport {
  branchId: string;
  branchName: string;
  type: string;
  revenue: number;
  orders: number;
}

export interface PaymentReport {
  method: string;
  revenue: number;
  count: number;
}

export interface InventoryValuationReport {
  branchValuations: Array<{
    branchId: string;
    branchName: string;
    totalItems: number;
    valuation: number;
  }>;
  lowStockItems: Array<{
    branchName: string;
    productName: string;
    quantity: number;
    threshold: number;
  }>;
  totalGlobalValuation: number;
}

export const reportService = {
  getSalesReport: async (startDate?: string, endDate?: string): Promise<SalesReport> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await axios.get(`${API_URL}/reports/sales?${params.toString()}`);
    return response.data;
  },

  getBranchReport: async (startDate?: string, endDate?: string): Promise<BranchReport[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await axios.get(`${API_URL}/reports/branches?${params.toString()}`);
    return response.data;
  },

  getPaymentReport: async (startDate?: string, endDate?: string): Promise<PaymentReport[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await axios.get(`${API_URL}/reports/payments?${params.toString()}`);
    return response.data;
  },

  getInventoryValuationReport: async (): Promise<InventoryValuationReport> => {
    const response = await axios.get(`${API_URL}/reports/inventory`);
    return response.data;
  }
};
