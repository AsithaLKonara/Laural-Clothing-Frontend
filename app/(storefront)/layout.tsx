import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import PromoBanner from "@/components/PromoBanner";

export const metadata: Metadata = {
  title: "Laural Clothing",
  description: "Pieces edited for quiet luxury — cut clean, worn easy.",
};

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-stone-50 text-stone-900 min-h-screen flex flex-col pt-[34px]">
      <CartProvider>
        <div className="fixed top-0 left-0 right-0 z-50">
          <PromoBanner />
          <Navbar />
        </div>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </CartProvider>
    </div>
  );
}
