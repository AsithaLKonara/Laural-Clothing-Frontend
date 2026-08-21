export interface ProductVariant {
  id: string;
  productId: string;
  name: string | null;
  sku: string | null;
  price: number;
  salePrice: number | null;
  stockStatus: string;
  quantity: number;
  color: string | null;
  size: string | null;
  featuredImage: string | null;
  gallery: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  excerpt: string | null;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[];
}
