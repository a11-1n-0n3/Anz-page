import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Careers } from "@/components/blocks/careers";
import { listJobs } from "@/lib/jobs";
import type { Locale } from "@/i18n/routing";

// Jobs live in Supabase and are added via the dashboard — render on every
// request so a newly inserted row shows up without a redeploy.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/careers">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "careers",
  });
  return { title: t("title") };
}

export default async function CareersPage({
  params,
}: PageProps<"/[locale]/careers">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Careers jobs={await listJobs()} />;
}
