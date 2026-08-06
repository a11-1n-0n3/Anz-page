import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";
import { ogLocales, routing, type Locale } from "@/i18n/routing";

import "../globals.css";

/**
 * Two faces, self-hosted via next/font — preloaded, subset, no layout shift.
 *
 * Both were checked against the Google Fonts metadata for a real `vietnamese`
 * subset (only 516 of 1942 families have one) and then rendered at 3x to
 * confirm the stacked marks — ằ ẵ ặ ỡ ự ỹ — sit correctly rather than falling
 * back mid-word. Popular picks like Instrument Serif, DM Serif Display,
 * Outfit, Sora and Figtree ship NO Vietnamese subset and break on this copy.
 *
 * Fraunces carries the headings: an old-style serif with enough warmth to read
 * as an established firm rather than another startup template, which is the
 * whole point of pairing it with the charcoal-and-gold palette.
 */
const fontDisplay = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  weight: ["600"],
  display: "swap",
});

/** Inter runs the body: neutral, dense, and legible at 14–15px. */
const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/** Pre-render both locales at build time — the pages stay fully static. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: Omit<LayoutProps<"/[locale]">, "children">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "site",
  });

  const title = `${siteConfig.name} — ${t("tagline")}`;
  const description = t("description");

  /** Home page per locale — Vietnamese is the default, so it has no prefix. */
  const isDefaultLocale = locale === routing.defaultLocale;
  const path = isDefaultLocale ? "/" : `/${locale}`;

  /**
   * Reference the shared image explicitly.
   *
   * `app/opengraph-image.tsx` sits outside `[locale]`, so Next generates the
   * asset but does NOT attach it to this route's metadata — without these
   * lines the pages ship no og:image at all and shared links have no preview.
   */
  const ogImage = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: title,
  };

  return {
    /**
     * REQUIRED. Without this, og:image resolves to a relative path and
     * Facebook / LinkedIn / Zalo drop the preview image when a link is shared.
     * Image itself comes from `app/opengraph-image.tsx` (one shared asset).
     */
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s | ${siteConfig.name}` },
    description,
    applicationName: siteConfig.name,
    /**
     * hreflang tells Google these two URLs are the same page in different
     * languages, so neither is treated as duplicate content. Without it the
     * English version barely gets indexed.
     */
    alternates: {
      canonical: path,
      languages: {
        vi: "/",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocales[locale as Locale],
      url: path,
      siteName: siteConfig.name,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  // An unsupported locale such as /fr should 404 rather than render empty.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for every Server Component below.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${fontSans.variable} ${fontDisplay.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/*
          Only messages a Client Component actually needs are shipped to the
          browser. Everything else is translated on the server and costs no
          bytes on the wire.
        */}
        <NextIntlClientProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
