"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

// usePathname/useRouter from i18n, not next/navigation — strips locale prefix
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
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium uppercase transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="sr-only">{t(locale)}</span>
            <span aria-hidden>{locale}</span>
          </button>
        );
      })}
    </div>
  );
}
