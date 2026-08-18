import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get<Category[]>("/categories");
    return response.data.map((c) => c.name);
  } catch (error) {
    return [];
  }
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
  try {
    const response = await api.get<AdminCategory[]>("/categories/admin");
    return response.data;
  } catch (error) {
    return [];
  }
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
  try {
    const response = await api.get<CollectionCategory[]>("/categories/collections");
    return response.data;
  } catch (error) {
    return [];
  }
};

export function useCollectionCategories() {
  return useQuery({
    queryKey: ["collectionCategories"],
    queryFn: fetchCollectionCategories,
  });
}
