import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Careers } from "@/components/careers";
import { listJobs } from "@/lib/jobs";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/careers">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "careers",
  });
  return { title: t("searchTitle"), description: t("description") };
}

export default async function CareersPage({
  params,
}: PageProps<"/[locale]/careers">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Careers jobs={listJobs()} />;
}
