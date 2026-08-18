import { useQuery } from "@tanstack/react-query";
import { collectionsService, Collection } from "../services/collections.service";

export const PUBLIC_COLLECTION_QUERY_KEYS = {
  all: ['public_collections'] as const,
  lists: () => [...PUBLIC_COLLECTION_QUERY_KEYS.all, 'list'] as const,
  detail: (slug: string) => [...PUBLIC_COLLECTION_QUERY_KEYS.all, 'detail', slug] as const,
};

export function useCollections() {
  return useQuery({
    queryKey: PUBLIC_COLLECTION_QUERY_KEYS.lists(),
    queryFn: () => collectionsService.getCollections(),
    select: (res) => {
      // Filter out only Active ones for the storefront
      return {
        ...res,
        data: res.data.filter(c => c.status === 'Active')
      };
    }
  });
}

export function useCollection(slug: string) {
  return useQuery({
    queryKey: PUBLIC_COLLECTION_QUERY_KEYS.detail(slug),
    // Right now the service gets by ID, we might need a getBySlug in service if we are routing by slug.
    // For now we assume we fetch all and find by slug, or backend supports getting by slug?
    // In our backend we have `getCollectionById`, but wait! I wrote `getCollectionBySlug` in the backend service, but didn't expose it in the controller! 
    queryFn: () => collectionsService.getCollections().then(res => res.data.find(c => c.slug === slug)),
    enabled: !!slug,
  });
}
