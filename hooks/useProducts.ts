import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService, GetProductsParams } from '../services/products.service';
import { Product } from '../types/product';

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

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => productsService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => productsService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(variables.id) });
      if (data.slug) {
        queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.detailBySlug(data.slug) });
      }
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });
    },
  });
}
