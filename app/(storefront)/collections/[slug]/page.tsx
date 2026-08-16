import { Metadata } from 'next';
import CollectionPageClient from './CollectionPageClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

// This function can eventually use prisma.collection.findUnique() based on the slug.
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
    description: `Explore our exclusive ${mockTitle} collection at Laural Clothing. Hand-picked pieces edited for quiet luxury.`,
    alternates: {
      canonical: `/collections/${slug}`,
    },
    openGraph: {
      title: `${mockTitle} Collection | Laural Clothing`,
      description: `Explore our exclusive ${mockTitle} collection at Laural Clothing.`,
      url: `/collections/${slug}`,
      images: [
        {
          url: '/hero-image/hero-1.jpg', // Mock image
          width: 1200,
          height: 630,
          alt: `${mockTitle} Collection`,
        }
      ],
    }
  };
}

export default function CollectionPage() {
  // Wait, does the client component accept params? Let's not pass params if we don't know it takes it.
  // The client component uses useParams() based on the head command output! 
  // "import { useParams } from 'next/navigation';"
  return <CollectionPageClient />;
}
