import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LAURAL POS",
  description: "Laural Clothing Point of Sale Terminal",
};

export default function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#E5E5E5] overflow-hidden select-none">
      {children}
    </div>
  );
}
