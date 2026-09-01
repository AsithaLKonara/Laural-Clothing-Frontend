import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services/categories.service";
import { Category } from "../types/category";

export const CATEGORY_QUERY_KEYS = {
  all: ['categories'] as const,
  lists: (params?: any) => params ? [...CATEGORY_QUERY_KEYS.all, 'list', params] as const : [...CATEGORY_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...CATEGORY_QUERY_KEYS.all, 'detail', id] as const,
};

export function useCategories(params?: { search?: string }, initialData?: any) {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.lists(params),
    queryFn: () => categoriesService.getCategories(params),
    staleTime: 1000 * 60 * 60, // 1 hour
    initialData,
  });
}

export function useCategory(id: string, initialData?: Category) {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.detail(id),
    queryFn: () => categoriesService.getCategoryById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
    initialData,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Category>) => categoriesService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => categoriesService.updateCategory(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() });
    },
  });
}

// Keeping the collection categories hook for storefront compatibility if needed
export interface CollectionCategory {
  id: number;
  title: string;
  imageUrl: string;
  href: string;
}

export function useCollectionCategories() {
  return useQuery({
    queryKey: ["collectionCategories"],
    queryFn: async (): Promise<CollectionCategory[]> => {
      return []; // Return empty for now as it's mocked in storefront
    },
  });
}
