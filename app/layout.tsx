import type { Metadata } from "next";
import { Poppins, Inria_Serif, Urbanist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://laural.lk'),
  title: {
    template: '%s | Laural Clothing',
    default: 'Laural Clothing',
  },
  description: 'Pieces edited for quiet luxury — cut clean, worn easy.',
  openGraph: {
    title: 'Laural Clothing',
    description: 'Pieces edited for quiet luxury — cut clean, worn easy.',
    url: '/',
    siteName: 'Laural Clothing',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Laural Clothing',
      },
    ],
    locale: 'en_LK',
    type: 'website',
  },
};

import Providers from "./providers";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import GlobalDialog from "@/components/ui/GlobalDialog";
import { MetaPixel } from "@/components/MetaPixel";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${orangeAvenue.variable} ${inriaSerif.variable} ${urbanist.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <Providers>
          <OrganizationSchema />
          {children}
          <GlobalDialog />
        </Providers>
      </body>
    </html>
  );
}
