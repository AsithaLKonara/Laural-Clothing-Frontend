import api from './api';

export interface InventoryItem {
  id: string;
  variantId: string;
  sku: string;
  name: string;
  productName: string;
  productId: string;
  color: string | null;
  size: string | null;
  price: number;
  imageUrl: string | null;
  quantity: number;
  reservedQty: number;
  sellable: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  stockStatus: 'instock' | 'lowstock' | 'outofstock';
}

export interface InventoryStats {
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  estimatedValue: number;
  totalSKUs: number;
}

export interface InventoryTransaction {
  id: string;
  variantId: string;
  type: string;
  quantityChange: number;
  reason: string | null;
  reference: string | null;
  createdAt: string;
  variant: {
    sku: string | null;
    name: string | null;
    product: { name: string };
  };
}

export interface StockTransfer {
  id: string;
  fromLocation: string;
  toLocation: string;
  variantId: string;
  quantity: number;
  status: string;
  requestedBy: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  variant: {
    sku: string | null;
    name: string | null;
    product: { name: string };
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const inventoryService = {
  async getInventory(params?: { search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<InventoryItem>> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const { data } = await api.get<PaginatedResponse<InventoryItem>>(`/inventory?${query}`);
    return data;
  },

  async getStats(): Promise<InventoryStats> {
    const { data } = await api.get<InventoryStats>('/inventory/stats');
    return data;
  },

  async getTransactions(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<InventoryTransaction>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const { data } = await api.get<PaginatedResponse<InventoryTransaction>>(`/inventory/transactions?${query}`);
    return data;
  },

  async adjustStock(payload: {
    variantId: string;
    type: 'RECEIVE' | 'DEDUCT';
    quantity: number;
    reason?: string;
    reference?: string;
  }): Promise<void> {
    await api.post('/inventory/adjust', payload);
  },

  async getTransfers(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<StockTransfer>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const { data } = await api.get<PaginatedResponse<StockTransfer>>(`/inventory/transfers?${query}`);
    return data;
  },

  async createTransfer(payload: {
    variantId: string;
    fromLocation: string;
    toLocation: string;
    quantity: number;
    requestedBy?: string;
    notes?: string;
  }): Promise<StockTransfer> {
    const { data } = await api.post<StockTransfer>('/inventory/transfers', payload);
    return data;
  },

  async updateTransferStatus(id: string, status: string): Promise<StockTransfer> {
    const { data } = await api.put<StockTransfer>(`/inventory/transfers/${id}/status`, { status });
    return data;
  },
};
