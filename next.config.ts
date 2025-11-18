import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';

const withSerwist = withSerwistInit({
  swSrc       : 'app/sw.ts',
  swDest      : 'public/sw.js',
  cacheOnNavigation: true,
  reloadOnOnline   : true,
  disable          : process.env.NODE_ENV === 'development'
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh'
      }
    ]
  },

  // Security and PWA headers
  async headers () {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key  : 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key  : 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key  : 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key  : 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key  : 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key  : 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key  : 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key  : 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGIN || 'http://localhost:3000'
          },
          {
            key  : 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key  : 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ]
      }
    ];
  }
};

export default withSerwist(nextConfig);
