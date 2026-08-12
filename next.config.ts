import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Generates <route>/index.html instead of <route>.html so trailing-slash
  // navigation maps directly to files in the Workers Static Assets bundle.
  trailingSlash: true,
  images: {
    // Static export has no Image Optimization server. Workers Static Assets
    // serves the generated files directly, so next/image passes them through.
    unoptimized: true,
  },
  // Prototype only — keep the normal checks enabled while development copy,
  // media and pricing remain explicitly gated from publication.
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
