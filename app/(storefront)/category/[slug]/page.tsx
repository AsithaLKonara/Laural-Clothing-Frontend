import { Metadata } from 'next';
import CategoryPageClient from './CategoryPageClient';

type Props = {
  params: Promise<{ slug: string }>;
};

// This function can eventually use prisma.category.findUnique() based on the slug.
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
    description: `Shop our ${mockTitle} category at Laural Clothing. Premium quality and sophisticated design for the modern wardrobe.`,
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      title: `${mockTitle} | Laural Clothing`,
      description: `Shop our ${mockTitle} category at Laural Clothing. Premium quality and sophisticated design.`,
      url: `/category/${slug}`,
      images: [
        {
          url: '/hero-image/hero-2.jpg', // Mock image
          width: 1200,
          height: 630,
          alt: `${mockTitle} Category`,
        }
      ],
    }
  };
}

export default function CategoryPage() {
  return <CategoryPageClient />;
}
