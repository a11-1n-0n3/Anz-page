import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/primitives/button";
import { Container, Frame, Section } from "@/components/primitives/section";
import { Link } from "@/i18n/navigation";
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
        <Frame className="surface-dark px-6 py-8 sm:px-12 sm:py-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-20 -z-10 size-96 rounded-full bg-brand-soft blur-3xl"
          />

          <dl className="grid gap-8 sm:grid-cols-2 sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <dt className="sr-only">{stat.label[locale]}</dt>
                <dd>
                  <span className="block text-3xl font-semibold tabular-nums text-white sm:text-5xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                    {stat.label[locale]}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="relative mt-12">
            <div
              aria-hidden
              className="absolute top-0 left-0 h-5 w-20 rounded-tl-[var(--frame-radius)] bg-brand"
            />
            <div className="mt-5 rounded-frame rounded-tl-none bg-brand px-4 py-5 text-white sm:px-10 sm:py-9">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                <div className="min-w-0 max-w-xl">
                  <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                    {t("title")}
                  </h2>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-white/85 sm:text-base">
                    {t("body")}
                  </p>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="shrink-0 border-white/80 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/#contact">
                    {t("cta")}
                    <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Frame>
      </Container>
    </Section>
  );
}
