import { api } from './api';
import { Product } from '../types/product';
import { PaginatedResponse } from '../types/api';

export interface GetProductsParams {
  skip?: number;
  take?: number;
  search?: string;
  category?: string;
}

export const productsService = {
  async getProducts(params?: GetProductsParams): Promise<PaginatedResponse<Product>> {
    const { data } = await api.get<PaginatedResponse<Product>>('/products', {
      params,
    });
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
