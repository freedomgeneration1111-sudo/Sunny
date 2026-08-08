import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Generates <route>/index.html instead of <route>.html. Verified by
  // serving the export locally: without this, /about/ 404s on a plain
  // static file server even though /about (no slash) resolves — Cloudflare
  // Pages' own smart routing would likely paper over this, but the
  // index.html-per-folder convention works unconditionally on any static
  // host and keeps internal links consistent either way.
  trailingSlash: true,
  images: {
    // Static export has no Image Optimization server (Cloudflare Pages
    // serves this as plain static files), so next/image just passes
    // through the original file instead of trying to resize on request.
    unoptimized: true,
  },
  // Prototype only — never let this get indexed while it's full of
  // proxy imagery and fabricated-free placeholder content.
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
