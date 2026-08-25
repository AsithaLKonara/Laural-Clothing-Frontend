import { api } from './api';
import { Product } from '../types/product';
import { PaginatedResponse } from '../types/api';

export interface GetProductsParams {
  skip?: number;
  take?: number;
  search?: string;
  category?: string;
  sizes?: string;
  colors?: string;
  minPrice?: number;
  maxPrice?: number;
  styles?: string;
  sort?: string;
}

export interface FilterMetadataResponse {
  sizes: string[];
  colors: string[];
  maxPrice: number;
  minPrice: number;
}

export const productsService = {
  async getProducts(params?: GetProductsParams): Promise<PaginatedResponse<Product>> {
    const { data } = await api.get<PaginatedResponse<Product>>('/products', {
      params,
    });
    return data;
  },

  async getFilterMetadata(): Promise<FilterMetadataResponse> {
    const { data } = await api.get<FilterMetadataResponse>('/products/filters/meta');
    return data;
  },

  async getProductById(id: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/slug/${slug}`);
    return data;
  },

  async getProductBySku(sku: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/sku/${sku}`);
    return data;
  },

  async createProduct(product: any): Promise<Product> {
    const { data } = await api.post<Product>('/products', product);
    return data;
  },

  async updateProduct(id: string, product: any): Promise<Product> {
    const { data } = await api.put<Product>(`/products/${id}`, product);
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
