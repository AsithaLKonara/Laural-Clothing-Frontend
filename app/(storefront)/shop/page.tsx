import { Suspense } from "react";
import ShopContent from "./ShopContent";

import { serverFetch } from "@/lib/server-fetch";
import { Product } from "@/types/product";
import { PaginatedResponse } from "@/types/api";

export const metadata = {
  title: "Shop - Laural Clothing",
  description: "Browse our latest collections of luxury clothing.",
};

export const revalidate = 300;

export default async function ShopPage() {
  const productsRes = await serverFetch<PaginatedResponse<Product>>("/products?skip=0&take=12", {
    next: { tags: ["products"], revalidate: 300 }
  }).catch(() => undefined);

  return (
    <Suspense fallback={<div className="flex h-[50vh] w-full items-center justify-center">Loading shop...</div>}>
      <ShopContent initialData={productsRes} />
    </Suspense>
  );
}
