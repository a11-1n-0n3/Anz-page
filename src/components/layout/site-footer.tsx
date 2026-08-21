import { useTranslations } from "next-intl";

import { BrandMark } from "@/components/primitives/brand-mark";
import { Container } from "@/components/primitives/section";
import { footerNav, siteConfig } from "@/lib/site";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tSite = useTranslations("site");
  const tContact = useTranslations("contact");

  return (
    <footer className="surface-dark mt-auto flex flex-1 flex-col justify-end rounded-t-frame">
      <Container className="py-10">
        <div className="flex flex-col gap-10 md:grid md:grid-cols-4 md:gap-12">
          <div className="md:col-span-2">
            <BrandMark size="md" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {tSite("description")}
            </p>
            <address className="mt-6 space-y-1 text-sm not-italic text-muted-foreground">
              <p>{tContact("address")}</p>
              <p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors hover:text-foreground"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
            </address>
          </div>

          <div className="grid grid-cols-2 gap-8 md:contents">
            {footerNav.map((group) => (
              <nav key={group.titleKey} aria-label={t(group.titleKey)}>
                <p className="text-sm font-semibold">{t(group.titleKey)}</p>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={`${group.titleKey}-${item.labelKey}`}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {tNav(item.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <p className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
          {t("rights", {
            year: String(new Date().getFullYear()),
            name: siteConfig.name,
          })}
        </p>
      </Container>
    </footer>
  );
}
