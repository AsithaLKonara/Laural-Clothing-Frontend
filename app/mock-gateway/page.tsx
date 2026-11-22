import { Suspense } from "react";
import MockGatewayClient from "./PageClient";

export default function MockGatewayPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading gateway...</div>}>
      <MockGatewayClient />
    </Suspense>
  );
}
