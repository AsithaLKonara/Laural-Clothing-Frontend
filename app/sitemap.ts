import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Use environment variable for base URL, fallback to production URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lauralclothing.com';
  
  // Define standard static routes
  const routes = [
    '',
    '/shop',
    '/sale',
    '/search',
    '/about',
    '/contact',
    '/track-order',
    '/returns',
    '/privacy-policy',
    '/terms-conditions',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/shop' || route === '/sale' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/shop' || route === '/sale' ? 0.9 : 0.7,
  }));
}
