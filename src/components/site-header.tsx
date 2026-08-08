import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/button";
import { Container } from "@/components/section";
import { mainNav } from "@/lib/site";
import { Link } from "@/i18n/navigation";

import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="surface-dark sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-18">
        <Link
          href="/"
          className="group rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          <BrandMark priority size="sm" />
        </Link>

        <nav aria-label={t("mainLabel")} className="hidden md:block">
          <ul className="flex items-center gap-6">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-2.5 py-1.5 text-sm font-medium text-foreground underline decoration-transparent underline-offset-[6px] transition-colors hover:decoration-current focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <Button asChild size="sm" variant="brand" className="hidden md:inline-flex">
            <Link href="/#contact">
              <ArrowUpRight aria-hidden strokeWidth={2} className="size-4" />
              {t("contact")}
            </Link>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
