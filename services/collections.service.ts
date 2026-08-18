import api from './api';

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  type: 'MANUAL' | 'AUTOMATED';
  status: string;
  rules: any;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export const collectionsService = {
  async getCollections(): Promise<{ data: Collection[]; total: number }> {
    const { data } = await api.get<{ data: Collection[]; total: number }>('/collections');
    return data;
  },

  async getCollectionById(id: string): Promise<Collection> {
    const { data } = await api.get<Collection>(`/collections/${id}`);
    return data;
  },

  async createCollection(collection: Partial<Collection>): Promise<Collection> {
    const { data } = await api.post<Collection>('/collections', collection);
    return data;
  },

  async updateCollection(id: string, collection: Partial<Collection>): Promise<Collection> {
    const { data } = await api.put<Collection>(`/collections/${id}`, collection);
    return data;
  },

  async deleteCollection(id: string): Promise<void> {
    await api.delete(`/collections/${id}`);
  },
};
