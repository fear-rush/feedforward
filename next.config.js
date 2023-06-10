/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PROD_URL: process.env.NEXT_PUBLIC_PRODUCTION_URL,
    DEV_URL: process.env.NEXT_PUBLIC_DEVELOPMENT_URL,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp'],
  }
}
// module.exports = nextConfig

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig);

