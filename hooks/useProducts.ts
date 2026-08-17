import { useQuery } from '@tanstack/react-query';
import { productsService, GetProductsParams } from '../services/products.service';

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
  list: (params?: GetProductsParams) => [...PRODUCT_QUERY_KEYS.lists(), params] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PRODUCT_QUERY_KEYS.details(), id] as const,
  detailBySlug: (slug: string) => [...PRODUCT_QUERY_KEYS.details(), 'slug', slug] as const,
};

export function useProducts(params?: GetProductsParams) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(params),
    queryFn: () => productsService.getProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id),
    queryFn: () => productsService.getProductById(id),
    enabled: !!id,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detailBySlug(slug),
    queryFn: () => productsService.getProductBySlug(slug),
    enabled: !!slug,
  });
}
