import { useTranslations } from "next-intl";

import { Container, Section, SectionHeading } from "@/components/section";

const stepIds = ["discovery", "pilot", "rollout"] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <Section id="how-it-works" className="bg-card">
      <Container>
        {/* Left-aligned like every other section heading on the page. */}
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-10">
          {/*
            Connector sits behind the numbers and stops at the first and last
            marker instead of running to the section edges.
          */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-5 right-[16.67%] left-[16.67%] hidden h-px bg-border md:block"
          />

          {stepIds.map((id, index) => (
            <li key={id} className="relative">
              <span
                aria-hidden
                className="relative z-10 flex size-10 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold tabular-nums text-gold-ink"
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
      </Container>
    </Section>
  );
}
