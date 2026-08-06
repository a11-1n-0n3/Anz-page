import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";
import { routing } from "@/i18n/routing";

// TODO(anz): once there is a blog, emit one entry per post per locale
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      locale === routing.defaultLocale
        ? siteConfig.url
        : `${siteConfig.url}/${locale}`,
    ]),
  );

  return routing.locales.map((locale) => ({
    url:
      locale === routing.defaultLocale
        ? siteConfig.url
        : `${siteConfig.url}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
