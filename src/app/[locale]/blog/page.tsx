import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProjectIndex } from "@/components/project-index";
import type { Locale } from "@/i18n/routing";
import { listPosts } from "@/lib/posts";

// Posts live in Supabase and are added via the dashboard — render on every
// request so a newly inserted row shows up without a redeploy.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "projects",
  });
  return { title: t("pageTitle"), description: t("pageDescription") };
}

export default async function ProjectsPage({
  params,
}: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProjectIndex posts={await listPosts()} />;
}
