import { useQuery } from "@tanstack/react-query";
import { mockProducts } from "../services/mockData";
import { api } from "../services/api";

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: string;
  priceFormatted: string;
  stock: number;
  status: string;
  image: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Future real API call:
  // const response = await api.get<Product[]>("/products");
  // return response.data;
  
  return mockProducts as Product[];
};

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}
