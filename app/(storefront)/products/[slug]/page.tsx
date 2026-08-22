import { Metadata } from 'next';
import ProductPageClient from './ProductPageClient';
import ProductSchema from '@/components/seo/ProductSchema';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600; // ISR every hour

async function getProductData(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductData(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  let allImages: string[] = [];
  if (product?.variants) {
    for (const v of product.variants) {
      if (v.featuredImage) allImages.push(v.featuredImage);
      if (v.gallery) allImages.push(...v.gallery);
    }
  }
  
  const deduplicateImages = (urls: string[]) => {
    const seen = new Set();
    const result = [];
    for (const url of urls) {
      if (!url) continue;
      try {
        const parsed = new URL(url);
        const filename = parsed.pathname.split('/').pop() || "";
        let baseFilename = filename;
        const match = filename.match(/^\d{13}-(.+)$/);
        if (match) baseFilename = match[1];
        if (!seen.has(baseFilename)) {
          seen.add(baseFilename);
          result.push(url);
        }
      } catch (e) {
        if (!seen.has(url)) {
          seen.add(url);
          result.push(url);
        }
      }
    }
    return result;
  };

  allImages = deduplicateImages(allImages);
  const ogImage = allImages[0] || '/hero-image/hero-1.jpg';
    
  return {
    title: product.name,
    description: product.description?.substring(0, 160) || `Discover the elegant ${product.name} at Laural Clothing. Designed for the modern aesthetic.`,
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: `${product.name} | Laural Clothing`,
      description: product.description?.substring(0, 160) || `Discover the elegant ${product.name} at Laural Clothing.`,
      url: `/products/${slug}`,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 1200,
          alt: product.name,
        }
      ],
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductData(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laural.lk';

  let allImages: string[] = [];
  if (product?.variants) {
    for (const v of product.variants) {
      if (v.featuredImage) allImages.push(v.featuredImage);
      if (v.gallery) allImages.push(...v.gallery);
    }
  }
  
  const deduplicateImages = (urls: string[]) => {
    const seen = new Set();
    const result = [];
    for (const url of urls) {
      if (!url) continue;
      try {
        const parsed = new URL(url);
        const filename = parsed.pathname.split('/').pop() || "";
        let baseFilename = filename;
        const match = filename.match(/^\d{13}-(.+)$/);
        if (match) baseFilename = match[1];
        if (!seen.has(baseFilename)) {
          seen.add(baseFilename);
          result.push(url);
        }
      } catch (e) {
        if (!seen.has(url)) {
          seen.add(url);
          result.push(url);
        }
      }
    }
    return result;
  };

  allImages = deduplicateImages(allImages);
  const schemaImage = allImages[0] || `${baseUrl}/hero-image/hero-1.jpg`;

  return (
    <>
      {product && (
        <ProductSchema
          name={product.name}
          description={product.description?.substring(0, 160) || `Discover the elegant ${product.name} at Laural Clothing.`}
          image={schemaImage}
          price={product.variants?.[0]?.price || 0}
          url={`${baseUrl}/products/${slug}`}
          sku={product.variants?.[0]?.sku || `SKU-${slug.toUpperCase()}`}
        />
      )}
      <ProductPageClient params={params} />
    </>
  );
}
