import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { ProjectDetail } from "@/components/project-detail";
import { getPost } from "@/lib/posts";
import type { Locale } from "@/i18n/routing";

// Posts live in Supabase and are added via the dashboard — render on every
// request so a newly inserted row shows up without a redeploy.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getPost(slug);
  if (!project) return {};

  const loc = locale as Locale;
  return {
    title: project.title[loc],
    description: project.excerpt[loc],
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getPost(slug);
  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
