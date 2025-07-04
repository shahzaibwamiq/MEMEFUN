import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['memesfun.mypinata.cloud'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'memesfun.mypinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
