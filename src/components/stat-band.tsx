import { useLocale, useTranslations } from "next-intl";

import { Container, Frame, Section } from "@/components/section";
import { stats } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

// Renders nothing while `stats` is empty — see the warning in lib/site.ts.
export function StatBand() {
  const t = useTranslations("stats");
  const locale = useLocale() as Locale;

  if (stats.length === 0) return null;

  return (
    <Section className="pb-0">
      <Container>
        <Frame className="surface-dark px-6 py-12 sm:px-12 sm:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-20 -z-10 size-96 rounded-full bg-neon-soft blur-3xl"
          />

          <p className="text-center text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            {t("label")}
          </p>

          <dl className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <dt className="sr-only">{stat.label[locale]}</dt>
                <dd>
                  <span className="block text-4xl font-semibold tabular-nums text-neon-ink sm:text-5xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                    {stat.label[locale]}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Frame>
      </Container>
    </Section>
  );
}
