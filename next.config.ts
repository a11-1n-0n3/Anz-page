import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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
    ],
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
