import { useQuery } from "@tanstack/react-query";
import { mockCategories, mockAdminCategories, mockCollectionCategories } from "../services/mockData";
import { api } from "../services/api";

const fetchCategories = async (): Promise<string[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Future real API call:
  // const response = await api.get<string[]>("/categories");
  // return response.data;
  
  return mockCategories;
};

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  parent: string;
  products: number;
  status: string;
}

const fetchAdminCategories = async (): Promise<AdminCategory[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockAdminCategories as AdminCategory[];
};

export function useAdminCategories() {
  return useQuery({
    queryKey: ["adminCategories"],
    queryFn: fetchAdminCategories,
  });
}

export interface CollectionCategory {
  id: number;
  title: string;
  imageUrl: string;
  href: string;
}

const fetchCollectionCategories = async (): Promise<CollectionCategory[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockCollectionCategories as CollectionCategory[];
};

export function useCollectionCategories() {
  return useQuery({
    queryKey: ["collectionCategories"],
    queryFn: fetchCollectionCategories,
  });
}
