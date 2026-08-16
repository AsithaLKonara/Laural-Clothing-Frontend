import { Metadata } from 'next';
import ProductPageClient from './ProductPageClient';
import ProductSchema from '@/components/seo/ProductSchema';

type Props = {
  params: Promise<{ slug: string }>;
};

// This function can eventually use prisma.product.findUnique() based on the slug.
// For now, it returns mock metadata based on the slug.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // Format slug to look like a title for mock purposes
  const mockTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  return {
    title: mockTitle,
    description: `Discover the elegant ${mockTitle} at Laural Clothing. Designed for the modern aesthetic.`,
    alternates: {
      canonical: `/product/${slug}`,
    },
    openGraph: {
      title: `${mockTitle} | Laural Clothing`,
      description: `Discover the elegant ${mockTitle} at Laural Clothing.`,
      url: `/product/${slug}`,
      images: [
        {
          url: '/hero-image/hero-1.jpg', // Mock image
          width: 800,
          height: 1200,
          alt: mockTitle,
        }
      ],
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const mockTitle = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laural.lk';

  return (
    <>
      <ProductSchema
        name={mockTitle}
        description={`Discover the elegant ${mockTitle} at Laural Clothing.`}
        image={`${baseUrl}/hero-image/hero-1.jpg`}
        price={2790}
        url={`${baseUrl}/product/${slug}`}
        sku={`SKU-${slug.toUpperCase()}`}
      />
      <ProductPageClient params={params} />
    </>
  );
}
