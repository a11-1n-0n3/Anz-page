import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "@/components/button";
import { Container } from "@/components/section";
import { mainNav, siteConfig } from "@/lib/site";
import { Link } from "@/i18n/navigation";

import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    /*
     * Floating pill instead of a full-width bar.
     * It only works because the page has a tinted background — on pure white
     * a white pill would be invisible. The two changes are a package.
     */
    <header className="sticky top-0 z-50 pt-3 sm:pt-4">
      <Container className="flex h-14 items-center justify-between gap-4 rounded-full border border-border/70 bg-card/85 px-4 shadow-[0_2px_18px_-8px_rgba(29,29,31,0.28)] backdrop-blur-md sm:h-16 sm:px-6 lg:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-md text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          <Image
            src="/assets/logo.png"
            alt=""
            width={28}
            height={28}
            className="size-7"
            priority
          />
          <span className="text-[15px] font-semibold tracking-[0.08em]">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label={t("mainLabel")} className="hidden md:block">
          <ul className="flex items-center gap-8">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          {/* Desktop CTA; phones get the same action inside the menu panel. */}
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/#contact">{t("contact")}</Link>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
