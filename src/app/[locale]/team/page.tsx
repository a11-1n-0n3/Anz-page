import {
  getLocale,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import type { Metadata } from "next";

import { CardGrid } from "@/components/primitives/card-grid";
import { CtaBand } from "@/components/blocks/cta-band";
import { EmptyState } from "@/components/blocks/empty-state";
import { PageHero } from "@/components/blocks/page-hero";
import { Card } from "@/components/primitives/card";
import { Container, Section } from "@/components/primitives/section";
import { team } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/team">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "team",
  });
  return { title: t("title"), description: t("description") };
}

export default async function TeamRoute({
  params,
}: PageProps<"/[locale]/team">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");
  const loc = (await getLocale()) as Locale;

  return (
    <>
      <PageHero title={t("title")} description={t("description")} />

      <Section className="pt-8 sm:pt-10">
        <Container>
          {team.length === 0 ? (
            <EmptyState>{t("empty")}</EmptyState>
          ) : (
            <CardGrid cols={3} className="gap-x-6 gap-y-12 sm:gap-x-6 sm:gap-y-12">
              {team.map((member) => (
                <li key={member.id}>
                  <Card
                    variant="portrait"
                    title={member.name}
                    meta={member.role[loc]}
                    description={member.bio[loc]}
                    image={member.photo}
                    titleAs="h2"
                  />
                </li>
              ))}
            </CardGrid>
          )}
        </Container>
      </Section>

      <CtaBand
        title={t("ctaTitle")}
        body={t("ctaBody")}
        actions={[
          {
            href: "/#contact",
            label: t("ctaContact"),
            variant: "brand",
            icon: "arrow-up-right",
          },
          {
            href: "/careers",
            label: t("ctaCareers"),
            variant: "outline",
          },
        ]}
      />
    </>
  );
}
