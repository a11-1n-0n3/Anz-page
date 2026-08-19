import { Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container, Eyebrow, Section } from "@/components/section";
import { siteConfig } from "@/lib/site";

import { ContactForm } from "./contact-form";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <Section id="contact">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="lg:pt-2">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="mt-3 text-balance text-2xl font-semibold sm:mt-4 sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
              {t("description")}
            </p>

            <dl className="mt-6 space-y-4 border-t border-border pt-6 sm:mt-10 sm:space-y-5 sm:pt-8">
              <div className="flex items-start gap-3">
                <dt className="mt-0.5">
                  <Mail aria-hidden strokeWidth={1.5} className="size-5 text-brand-ink" />
                  <span className="sr-only">{t("orEmail")}</span>
                </dt>
                <dd>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-[15px] font-medium underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                  >
                    {siteConfig.contact.email}
                  </a>
                </dd>
              </div>

              <div className="flex items-start gap-3">
                <dt className="mt-0.5">
                  <MapPin aria-hidden strokeWidth={1.5} className="size-5 text-brand-ink" />
                </dt>
                <dd className="text-[15px] text-muted-foreground">
                  {t("address")}
                </dd>
              </div>
            </dl>
          </div>

          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
