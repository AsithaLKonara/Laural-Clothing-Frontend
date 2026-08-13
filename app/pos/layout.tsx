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
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden select-none">
      {children}
    </div>
  );
}
