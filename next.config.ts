import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents:true,
  images: {
    remotePatterns: [
     
      {
        protocol: "https",
        hostname: "glad-clam-257.convex.cloud",
        port: "",
       
      },
       {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
       
      },
    ],
  },
};

export default nextConfig;
