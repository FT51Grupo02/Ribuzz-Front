/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'res.cloudinary.com'],
    unoptimized: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ribuzz-backend-ftn4.onrender.com/:path*',
      },
    ];
  },
};

export default nextConfig;