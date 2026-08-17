export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  excerpt: string | null;
  price: number;
  salePrice: number | null;
  sku: string | null;
  stockStatus: string;
  quantity: number;
  featuredImage: string | null;
  gallery: string[];
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}
