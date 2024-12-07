import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "snaplink.s3.amazonaws.com",
      "https://snaplink.s3.eu-west-2.amazonaws.com",
      "snaplink.s3.eu-west-2.amazonaws.com",
    ],
  },
};

export default nextConfig;
