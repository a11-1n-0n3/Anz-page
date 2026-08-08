import { getTranslations } from "next-intl/server";

import { Container, Section } from "@/components/section";

// Asymmetric on purpose — breaks the "eyebrow + heading + even grid" rhythm
// that every other section on the page repeats.
export async function Statement() {
  const t = await getTranslations("statement");

  return (
    <Section className="pb-0">
      <Container>
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-end md:gap-16">
          <h2 className="text-balance text-3xl leading-[1.12] font-semibold sm:text-4xl lg:text-[2.75rem]">
            {t("title")}
          </h2>
          <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("body")}
          </p>
        </div>
      </Container>
    </Section>
  );
}
