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
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="lg:pt-2">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("description")}
            </p>

            <dl className="mt-10 space-y-5 border-t border-border pt-8">
              <div className="flex items-start gap-3">
                <dt className="mt-0.5">
                  <Mail aria-hidden strokeWidth={1.5} className="size-5 text-neon-ink" />
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
                  <MapPin aria-hidden strokeWidth={1.5} className="size-5 text-neon-ink" />
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
