/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'localhost',
      'la-casita-uploads.s3.amazonaws.com',
      's3.amazonaws.com',
      'via.placeholder.com'
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  // Enable React's new streaming and server components
  experimental: {
    serverComponentsExternalPackages: ['@aws-sdk/client-s3'],
    serverActions: true,
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // Environment variables that should be available in the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
  // Enable SWC minification
  swcMinify: true,
  // Enable React Strict Mode
  reactStrictMode: true,
}

module.exports = nextConfig
