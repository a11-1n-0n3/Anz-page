import { defineRouting } from "next-intl/routing";

/**
 * Locale routing configuration.
 *
 * URL strategy — `localePrefix: "as-needed"`:
 *   /        → Vietnamese (default locale, no prefix)
 *   /en      → English
 *
 * Vietnamese sits at the root because it is the primary market, so existing
 * backlinks and search results keep working unchanged.
 */
export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "as-needed",
  /**
   * Remember the visitor's choice for a year. Thanks to this cookie, someone
   * who switched to English lands on /en next time they open /.
   */
  localeCookie: {
    maxAge: 365 * 24 * 60 * 60,
  },
});

export type Locale = (typeof routing.locales)[number];

/** Full locale codes for the og:locale tag and date/number formatting. */
export const ogLocales: Record<Locale, string> = {
  vi: "vi_VN",
  en: "en_US",
};
