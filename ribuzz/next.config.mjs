/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['images.pexels.com'], 
      unoptimized: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
  
  export default nextConfig;
  