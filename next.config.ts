import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import createNextIntlPlugin from "next-intl/plugin";

// SUPABASE_URL is runtime-only in Docker, so allow any Supabase host by wildcard.
const storagePath = "/storage/v1/object/public/**";

function supabaseHostPattern(): RemotePattern[] {
  const url = process.env.SUPABASE_URL?.trim();
  if (!url) return [];
  try {
    const { protocol, hostname, port } = new URL(url);
    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port,
        pathname: storagePath,
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  // Smaller image for Docker — traces only the files the server needs
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "**.supabase.co", pathname: storagePath },
      { protocol: "https", hostname: "**.supabase.in", pathname: storagePath },
      ...supabaseHostPattern(),
    ],
    // Local Supabase serves storage from 127.0.0.1, which next/image refuses as SSRF.
    dangerouslyAllowLocalIP: process.env.IMAGE_ALLOW_LOCAL_IP === "1",
  },
  async redirects() {
    return [
      { source: "/projects", destination: "/blog", permanent: true },
      { source: "/projects/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/en/projects", destination: "/en/blog", permanent: true },
      {
        source: "/en/projects/:slug",
        destination: "/en/blog/:slug",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
