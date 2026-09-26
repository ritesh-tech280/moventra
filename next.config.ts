import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins:['10.185.3.63'] ,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }],
  },
};

export default nextConfig;
