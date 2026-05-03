import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel Blob serves uploaded files (e.g. project images) from this host.
  // Allow it through next/image. Add other hosts here if you reference
  // external images directly.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
  },
};

export default nextConfig;
