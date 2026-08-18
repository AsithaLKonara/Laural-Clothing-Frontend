import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionsService, Collection } from "../services/collections.service";

export const COLLECTION_QUERY_KEYS = {
  all: ['admin_collections'] as const,
  lists: () => [...COLLECTION_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...COLLECTION_QUERY_KEYS.all, 'detail', id] as const,
};

export function useAdminCollections() {
  return useQuery({
    queryKey: COLLECTION_QUERY_KEYS.lists(),
    queryFn: () => collectionsService.getCollections(),
  });
}

export function useAdminCollection(id: string) {
  return useQuery({
    queryKey: COLLECTION_QUERY_KEYS.detail(id),
    queryFn: () => collectionsService.getCollectionById(id),
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Collection>) => collectionsService.createCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Collection> }) => collectionsService.updateCollection(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.lists() });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => collectionsService.deleteCollection(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.lists() });
    },
  });
}
