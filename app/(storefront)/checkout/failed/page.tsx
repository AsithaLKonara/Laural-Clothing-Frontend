import { Suspense } from "react";
import CheckoutFailedClient from "./PageClient";

export default function CheckoutFailedPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <CheckoutFailedClient />
    </Suspense>
  );
}
