import type { MetadataRoute } from "next";

import { posts, siteConfig } from "@/lib/site";
import { routing } from "@/i18n/routing";

const staticPaths = ["", "/team", "/blog", "/careers"] as const;

function localeUrl(locale: string, path: string) {
  const base =
    locale === routing.defaultLocale
      ? siteConfig.url
      : `${siteConfig.url}/${locale}`;
  return path ? `${base}${path}` : base;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const postPaths = posts.map((p) => `/blog/${p.slug}`);
  const paths = [...staticPaths, ...postPaths];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => {
      const languages = Object.fromEntries(
        routing.locales.map((l) => [l, localeUrl(l, path)]),
      );

      return {
        url: localeUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority:
          path === ""
            ? locale === routing.defaultLocale
              ? 1
              : 0.8
            : path.startsWith("/blog/")
              ? 0.5
              : 0.6,
        alternates: { languages },
      };
    }),
  );
}
