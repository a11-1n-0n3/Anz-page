import { useTranslations } from "next-intl";

import { Container, Frame, Section, SectionHeading } from "@/components/section";

const stepIds = ["discovery", "pilot", "rollout"] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <Section id="how-it-works" className="pt-0">
      <Container>
        <Frame className="border border-border bg-secondary px-6 py-14 sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 -z-10 size-80 rounded-full bg-neon-soft blur-3xl"
          />

          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />

          <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-10">
            <div
              aria-hidden
              className="pointer-events-none absolute top-6 right-[16.67%] left-[16.67%] hidden h-px bg-border md:block"
            />

            {stepIds.map((id, index) => (
              <li key={id} className="relative">
                <span
                  aria-hidden
                  className="relative z-10 flex size-12 items-center justify-center rounded-full bg-card text-sm font-semibold tabular-nums text-neon-ink ring-1 ring-neon/30"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-base font-semibold tracking-tight">
                  {t(`steps.${id}.title`)}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
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
