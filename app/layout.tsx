import type { Metadata } from "next";
import { Poppins, Inria_Serif } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inriaSerif = Inria_Serif({
  variable: "--font-inria",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const orangeAvenue = localFont({
  src: "../public/fonts/orange-avenue-demo.regular.otf",
  variable: "--font-signature",
});

export const metadata: Metadata = {
  title: "Laural Clothing",
  description: "Pieces edited for quiet luxury — cut clean, worn easy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${orangeAvenue.variable} ${inriaSerif.variable} antialiased bg-stone-50 text-stone-900`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
