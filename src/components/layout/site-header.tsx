import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { BrandMark } from "@/components/primitives/brand-mark";
import { Button } from "@/components/primitives/button";
import { Container } from "@/components/primitives/section";
import { mainNav } from "@/lib/site";
import { Link } from "@/i18n/navigation";

import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <>
      {/* fixed (not sticky): body overflow:hidden on mobile menu open would unstick sticky */}
      <header className="surface-dark fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <Container className="flex h-16 min-w-0 items-center justify-between gap-3 sm:h-18 sm:gap-4">
          <Link
            href="/"
            className="group rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            <BrandMark priority />
          </Link>

          <nav aria-label={t("mainLabel")} className="hidden md:block">
            <ul className="flex items-center gap-1 lg:gap-6">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-2 py-1.5 text-[13px] font-medium text-foreground underline decoration-transparent underline-offset-[6px] transition-colors hover:decoration-current focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:px-2.5 lg:text-sm"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Button asChild variant="brand" className="hidden lg:inline-flex">
              <Link href="/#contact">
                <ArrowUpRight aria-hidden strokeWidth={2} className="size-4" />
                {t("contact")}
              </Link>
            </Button>
            <MobileNav />
          </div>
        </Container>
      </header>
      <div className="h-16 shrink-0 sm:h-18" aria-hidden />
    </>
  );
}
