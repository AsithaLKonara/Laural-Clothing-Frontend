/** @type {import('next').NextConfig} */

let apiOrigin = 'http://localhost:5000';
try {
  apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').origin;
} catch (e) {
  // fallback if URL is invalid
}

const securityHeaders = [
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Prevent MIME type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Control referrer information
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Restrict browser features
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  // Content Security Policy
  // Note: Turnstile requires challenges.cloudflare.com; Cloudinary for images
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self + Cloudflare Turnstile widget
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
      // Styles: self + inline (Tailwind)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + Cloudinary + S3 + data URIs + blob
      "img-src 'self' data: blob: https://res.cloudinary.com https://t3.storageapi.dev https://images.unsplash.com",
      // XHR/fetch: self + backend API + Cloudflare Turnstile verify
      "connect-src 'self' " + apiOrigin + " https://challenges.cloudflare.com",
      // iFrames: only Turnstile uses iframes
      "frame-src https://challenges.cloudflare.com",
      // Block object/embed tags
      "object-src 'none'",
      // Prevent base tag hijacking
      "base-uri 'self'",
      // Only allow forms to submit to self
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  async rewrites() {
    const apiDest = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiDest}/:path*`,
      },
    ];
  },
  headers: async () => [
    {
      // Apply security headers to all routes
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't3.storageapi.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

