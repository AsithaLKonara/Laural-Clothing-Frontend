import { api } from './api';

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
  customer?: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  product?: {
    name: string;
    slug: string;
  };
}

export const reviewService = {
  createReview: async (data: {
    productId: string;
    customerId: string;
    rating: number;
    title?: string;
    comment?: string;
    images?: string[];
    _honeypot?: string;
    turnstileToken?: string;
  }): Promise<Review> => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  getReviewsForProduct: async (productId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  getCustomerReviews: async (customerId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/customer/${customerId}`);
    return response.data;
  },

  getPendingReviews: async (customerId: string): Promise<any[]> => {
    const response = await api.get(`/reviews/pending/${customerId}`);
    return response.data;
  },

  getAllReviews: async (status?: string): Promise<Review[]> => {
    const params = status && status !== 'ALL' ? { status } : {};
    const response = await api.get('/reviews', { params });
    return response.data;
  },

  updateReviewStatus: async (id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<Review> => {
    const response = await api.patch(`/reviews/${id}/status`, { status });
    return response.data;
  },

  deleteReview: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};
