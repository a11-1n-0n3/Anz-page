import { useTranslations } from "next-intl";

import { Container, Frame, Section, SectionHeading } from "@/components/section";

const stepIds = ["discovery", "pilot", "rollout"] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <Section id="how-it-works" className="pt-0">
      <Container>
          <Frame className="border border-border bg-secondary px-4 py-6 sm:px-12 sm:py-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 -z-10 size-80 rounded-full bg-brand-soft blur-3xl"
          />

          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />

          <ol className="relative -mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0">
            <div
              aria-hidden
              className="pointer-events-none absolute top-6 right-[16.67%] left-[16.67%] hidden h-px bg-border md:block"
            />

            {stepIds.map((id, index) => (
              <li
                key={id}
                className="relative w-[min(78vw,19rem)] shrink-0 snap-start md:w-auto md:min-w-0"
              >
                <span
                  aria-hidden
                  className="relative z-10 flex size-9 items-center justify-center rounded-full bg-card text-xs font-semibold tabular-nums text-brand-ink ring-1 ring-brand/30 sm:size-12 sm:text-sm"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-sm font-semibold tracking-tight sm:mt-5 sm:text-base">
                  {t(`steps.${id}.title`)}
                </h3>
                <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
                  {t(`steps.${id}.description`)}
                </p>
              </li>
            ))}
          </ol>
        </Frame>
      </Container>
    </Section>
  );
}
