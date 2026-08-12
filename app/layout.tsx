import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "Laural Clothing",
  description: "E-Commerce Storefront",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-stone-50 text-stone-900`}>
        {children}
      </body>
    </html>
  );
}
