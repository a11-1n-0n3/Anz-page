import Image from "next/image";
import { Quote } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Container, Section, SectionHeading } from "@/components/section";
import { testimonials } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

// Renders nothing while `testimonials` is empty — see the warning in lib/site.ts.
export function Testimonials() {
  const t = useTranslations("testimonials");
  const locale = useLocale() as Locale;

  if (testimonials.length === 0) return null;

  return (
    // Flat, not a tinted Frame — HowItWorks directly above is already one, and
    // two near-identical bands in a row read as a rendering repeat.
    <Section>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />

          <ul className="grid gap-5">
            {testimonials.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-border bg-card p-7"
              >
                {item.logo ? (
                  <Image
                    src={item.logo}
                    alt={item.company}
                    width={120}
                    height={32}
                    className="h-7 w-auto"
                  />
                ) : (
                  <Quote
                    aria-hidden
                    strokeWidth={1.5}
                    className="size-6 text-neon-ink"
                  />
                )}

                <blockquote className="mt-5 text-pretty text-[15px] leading-relaxed text-neon-ink">
                  {item.quote[locale]}
                </blockquote>

                <footer className="mt-5 border-t border-border pt-4 text-sm">
                  <span className="font-semibold">{item.author}</span>
                  <span className="text-muted-foreground">
                    {" — "}
                    {item.role[locale]}, {item.company}
                  </span>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
