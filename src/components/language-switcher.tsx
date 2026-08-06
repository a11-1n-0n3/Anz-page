"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Vietnamese ↔ English toggle.
 *
 * Uses next-intl's `usePathname` / `useRouter`, NOT the ones from
 * `next/navigation`: next-intl's `usePathname` strips the locale prefix, so on
 * `/en` it returns `/`. That is what lets switching languages stay on the
 * current page instead of always bouncing to the home page.
 *
 * `router.replace` also writes the locale cookie, so the choice sticks on the
 * next visit.
 */
export function LanguageSwitcher() {
  const t = useTranslations("languageSwitcher");
  const activeLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(locale: Locale) {
    if (locale === activeLocale) return;

    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "flex items-center rounded-full border border-border p-0.5",
        isPending && "opacity-60",
      )}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === activeLocale;

        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            onClick={() => switchTo(locale)}
            disabled={isPending}
            // Screen readers need to know which option is selected.
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium uppercase transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {/* Full name for screen readers, short code for sighted users */}
            <span className="sr-only">{t(locale)}</span>
            <span aria-hidden>{locale}</span>
          </button>
        );
      })}
    </div>
  );
}
