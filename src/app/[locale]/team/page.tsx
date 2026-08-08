import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TeamPage } from "@/components/team-grid";
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

  return <TeamPage />;
}
