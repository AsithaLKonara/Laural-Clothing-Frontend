import { Metadata } from 'next';
import ProductPageClient from './ProductPageClient';
import ProductSchema from '@/components/seo/ProductSchema';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600; // ISR every hour

async function getProductData(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products/slug/${slug}`, { next: { revalidate: 3600 } });
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
          url: product.variants?.[0]?.featuredImage || '/hero-image/hero-1.jpg',
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

  return (
    <>
      {product && (
        <ProductSchema
          name={product.name}
          description={product.description?.substring(0, 160) || `Discover the elegant ${product.name} at Laural Clothing.`}
          image={product.variants?.[0]?.featuredImage ? product.variants[0].featuredImage : `${baseUrl}/hero-image/hero-1.jpg`}
          price={product.variants?.[0]?.price || 0}
          url={`${baseUrl}/products/${slug}`}
          sku={product.variants?.[0]?.sku || `SKU-${slug.toUpperCase()}`}
        />
      )}
      <ProductPageClient params={params} />
    </>
  );
}
