/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable React strict mode during development to avoid double rendering
  reactStrictMode: false,
  // Disable static generation for problematic pages
  experimental: {
    workerThreads: false,
    cpus: 1
  }
};

export default nextConfig;
