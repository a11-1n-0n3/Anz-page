import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
     * The header carries `surface-dark` PERMANENTLY, not just while it sits
     * over the hero.
     *
     * It is sticky, and the page runs dark hero → light body → dark footer. A
     * transparent bar would put its light text on the light sections and
     * disappear halfway down the page. Recolouring on scroll would mean a
     * scroll listener and turning this into a Client Component for a purely
     * cosmetic effect. Holding one colour costs a small seam where the bar
     * meets the light sections, and nothing else.
     */
    <header className="surface-dark sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-18">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-md text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          <Image
            src="/assets/logo.png"
            alt=""
            width={28}
            height={28}
            /*
             * `rounded-md`: the source PNG has an opaque white background (RGB,
             * no alpha), so on the dark bar it renders as a white tile no
             * matter what. Rounding it makes that tile read as a deliberate
             * badge rather than a clipping bug. The real fix is a logo file
             * with a transparent background.
             */
            className="size-7 rounded-md"
            priority
          />
          <span className="font-display text-[15px] font-bold tracking-[0.06em]">
            {siteConfig.name}
          </span>
        </Link>

        {/*
          Each item is its own pill rather than a bare link in a row. It is the
          cheapest way to make a nav read as a control surface instead of a
          sentence, and it gives the hit area some height on a bar this tall.
        */}
        <nav aria-label={t("mainLabel")} className="hidden md:block">
          <ul className="flex items-center gap-1.5">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-full bg-white/[0.06] px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.12] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
