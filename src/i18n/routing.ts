import { defineRouting } from "next-intl/routing";

// / = vi (default), /en = English
export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "as-needed",
  localeCookie: {
    maxAge: 365 * 24 * 60 * 60,
  },
});

export type Locale = (typeof routing.locales)[number];

export const ogLocales: Record<Locale, string> = {
  vi: "vi_VN",
  en: "en_US",
};
