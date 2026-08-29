import { api } from './api';
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

export interface CustomerReport {
  totalNew: number;
  registered: number;
  guest: number;
  topCustomers: Array<{
    id: string;
    name: string;
    isGuest: boolean;
    spent: number;
    orderCount: number;
  }>;
}

export interface PosReport {
  summary: {
    totalSessions: number;
    totalVariance: number;
    expectedTotal: number;
    actualTotal: number;
  };
  terminals: Array<{
    terminalName: string;
    revenue: number;
    sessionCount: number;
  }>;
}

export interface PromotionsReport {
  vouchers: {
    issued: number;
    used: number;
    outstandingLiability: number;
  };
  coupons: {
    issued: number;
    totalUsages: number;
  };
}

export const reportService = {
  getSalesReport: async (startDate?: string, endDate?: string): Promise<SalesReport> => {
    const params = { startDate, endDate };
    const response = await api.get('/reports/sales', { params });
    return response.data;
  },

  getBranchReport: async (startDate?: string, endDate?: string): Promise<BranchReport[]> => {
    const params = { startDate, endDate };
    const response = await api.get('/reports/branches', { params });
    return response.data;
  },

  getPaymentReport: async (startDate?: string, endDate?: string): Promise<PaymentReport[]> => {
    const params = { startDate, endDate };
    const response = await api.get('/reports/payments', { params });
    return response.data;
  },

  getInventoryValuationReport: async (): Promise<InventoryValuationReport> => {
    const response = await api.get(`/reports/inventory`);
    return response.data;
  },

  getCustomerReport: async (startDate?: string, endDate?: string): Promise<CustomerReport> => {
    const params = { startDate, endDate };
    const response = await api.get('/reports/customers', { params });
    return response.data;
  },

  getPosReport: async (startDate?: string, endDate?: string): Promise<PosReport> => {
    const params = { startDate, endDate };
    const response = await api.get('/reports/pos', { params });
    return response.data;
  },

  getPromotionsReport: async (startDate?: string, endDate?: string): Promise<PromotionsReport> => {
    const params = { startDate, endDate };
    const response = await api.get('/reports/promotions', { params });
    return response.data;
  }
};
