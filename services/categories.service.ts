import api from './api';
import { Category } from '../types/category';

export const categoriesService = {
  async getCategories(params?: { search?: string }): Promise<{ data: Category[]; total: number }> {
    const { data } = await api.get<{ data: Category[]; total: number }>('/categories', { params });
    return data;
  },

  async getCategoryById(id: string): Promise<Category> {
    const { data } = await api.get<Category>(`/categories/${id}`);
    return data;
  },

  async createCategory(category: Partial<Category>): Promise<Category> {
    const { data } = await api.post<Category>('/categories', category);
    return data;
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const { data } = await api.put<Category>(`/categories/${id}`, category);
    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
