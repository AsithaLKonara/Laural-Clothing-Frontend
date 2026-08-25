import { Suspense } from "react";
import ClientContent from "./ClientContent";

import { serverFetch } from "@/lib/server-fetch";
import { Product } from "@/types/product";
import { PaginatedResponse } from "@/types/api";

export const metadata = {
  title: "Sale - Laural Clothing",
  description: "Sale page for Laural Clothing."
};

export const revalidate = 300;

export default async function Page() {
  const productsRes = await serverFetch<PaginatedResponse<Product>>("/products?skip=0&take=12", {
    next: { tags: ["products"], revalidate: 300 }
  }).catch(() => undefined);

  return (
    <Suspense fallback={<div className="flex h-[50vh] w-full items-center justify-center">Loading sale...</div>}>
      <ClientContent initialData={productsRes} />
    </Suspense>
  );
}
