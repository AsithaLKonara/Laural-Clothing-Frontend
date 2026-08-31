export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
    legacyProducts: number;
  };
  imageUrl?: string | null;
}
